"""
Automated Pytest Suite for SparkStart API & RAG Sequencer
Tests health, knowledge retrieval, task CRUD, adaptive sequencing, shrink mechanics, and privacy purges.
"""

import pytest
from fastapi.testclient import TestClient

from services.api.main import app
from services.api.storage.database import init_db
from services.api.storage.repository import repository

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_test_db():
    init_db()
    # Clean repository before each test
    repository.purge_all()
    yield
    repository.purge_all()


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["aiProvider"] in ("mock", "gemini", "openai")
    assert data["indexedKnowledgeChunks"] > 0


def test_knowledge_retrieval():
    # 1. Fetch sources
    res = client.get("/api/knowledge")
    assert res.status_code == 200
    sources = res.json()
    assert len(sources) >= 5
    assert any("Gollwitzer" in s["authors"] for s in sources)

    # 2. Search knowledge
    search_res = client.post("/api/knowledge/search", json={"query": "activation energy low resistance", "topK": 2})
    assert search_res.status_code == 200
    search_data = search_res.json()
    assert len(search_data["results"]) > 0
    assert "topic" in search_data["results"][0]


def test_task_crud():
    # 1. Create Task
    create_res = client.post(
        "/api/tasks",
        json={
            "title": "Complete DBMS Assignment 3",
            "description": "SQL joins and normal forms",
            "energy": "low",
        },
    )
    assert create_res.status_code == 200
    task = create_res.json()
    assert task["title"] == "Complete DBMS Assignment 3"
    assert task["completedStepsCount"] == 0
    task_id = task["id"]

    # 2. List Tasks
    list_res = client.get("/api/tasks")
    assert list_res.status_code == 200
    tasks = list_res.json()
    assert len(tasks) == 1
    assert tasks[0]["id"] == task_id

    # 3. Step Done
    step_res = client.post(f"/api/tasks/{task_id}/step-done")
    assert step_res.status_code == 200
    assert step_res.json()["completedStepsCount"] == 1

    # 4. Delete Task
    del_res = client.delete(f"/api/tasks/{task_id}")
    assert del_res.status_code == 200
    assert del_res.json()["deleted"] is True


def test_task_decomposition_and_completion_lifecycle():
    # 1. Create task
    create_res = client.post(
        "/api/tasks",
        json={"title": "Write Python Unit Tests", "energy": "medium"},
    )
    assert create_res.status_code == 200
    task = create_res.json()
    task_id = task["id"]
    assert len(task.get("subtasks", [])) > 0
    subtasks = task["subtasks"]
    assert subtasks[0]["stepOrder"] == 1
    total_steps = len(subtasks)

    # 2. Advance step by step using subtask id
    for step in subtasks:
        res = client.post(f"/api/tasks/{task_id}/steps/{step['id']}/done")
        assert res.status_code == 200

    # 3. Verify task is completed
    updated_task = client.get(f"/api/tasks/{task_id}").json()
    assert updated_task["status"] == "completed"
    assert updated_task["completedStepsCount"] == total_steps

    # 4. Reopen task
    reopen_res = client.post(f"/api/tasks/{task_id}/reopen")
    assert reopen_res.status_code == 200
    reopened = reopen_res.json()
    assert reopened["status"] == "in_progress"
    assert reopened["completedStepsCount"] == total_steps - 1

    # Cleanup
    client.delete(f"/api/tasks/{task_id}")


def test_adaptive_sequencing_flow():
    # Create a task
    t_res = client.post(
        "/api/tasks",
        json={"title": "Build React Components for Profile", "energy": "low"},
    )
    task_id = t_res.json()["id"]

    # Request next step
    seq_res = client.post(
        "/api/sequence/next",
        json={
            "taskId": task_id,
            "taskTitle": "Build React Components for Profile",
            "energyLevel": "low",
            "obstacle": "Feeling mentally exhausted",
        },
    )
    assert seq_res.status_code == 200
    data = seq_res.json()
    assert "actionText" in data
    assert data["suggestedDurationMinutes"] <= 3  # Low energy must be tiny
    assert "encouragement" in data
    assert "whyItIsManageable" in data
    assert len(data["sourceReferences"]) > 0

    # Test "Too Big" Shrink
    shrink_res = client.post(
        "/api/sequence/shrink",
        json={
            "taskId": task_id,
            "taskTitle": "Build React Components for Profile",
            "currentActionText": data["actionText"],
            "energyLevel": "low",
        },
    )
    assert shrink_res.status_code == 200
    shrink_data = shrink_res.json()
    assert shrink_data["suggestedDurationMinutes"] == 1
    assert "whyItIsManageable" in shrink_data


def test_privacy_export_and_purge():
    # Insert data
    client.post("/api/tasks", json={"title": "Private Task 1"})

    # Export
    export_res = client.get("/api/privacy/export")
    assert export_res.status_code == 200
    export_data = export_res.json()
    assert len(export_data["tasks"]) == 1

    # Purge
    purge_res = client.post("/api/privacy/purge")
    assert purge_res.status_code == 200
    assert purge_res.json()["purged"] is True

    # Confirm empty
    list_res = client.get("/api/tasks")
    assert len(list_res.json()) == 0


def test_preferences_crud():
    # 1. Fetch default
    res = client.get("/api/preferences")
    assert res.status_code == 200
    prefs = res.json()
    assert prefs["theme"] in ("light", "system", "dark", "forest", "lavender", "warm", "high-contrast")
    assert prefs["character"] == "sprout"

    # 2. Update preferences
    update_res = client.put(
        "/api/preferences",
        json={
            "theme": "forest",
            "character": "panda",
            "preferredStepDurationMinutes": 10,
            "enableSparkBuddy": True,
            "enableDesktopNotifications": True,
            "reminderFrequencyMinutes": 45,
            "quietHoursStart": "23:00",
            "quietHoursEnd": "07:00",
            "globalPause": False,
            "enableRemoteAI": False,
            "aiProvider": "mock",
            "reducedMotion": True,
            "defaultEnergy": "low",
        },
    )
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["theme"] == "forest"
    assert updated["character"] == "panda"
    assert updated["preferredStepDurationMinutes"] == 10

    # 3. Verify persistence
    get_again = client.get("/api/preferences")
    assert get_again.status_code == 200
    assert get_again.json()["character"] == "panda"


def test_invalid_task_inputs():
    # Empty title
    bad_res = client.post("/api/tasks", json={"title": "   "})
    # Expect either 422 validation error or 400
    assert bad_res.status_code in (400, 422)

    # Missing task for step done
    missing_step = client.post("/api/tasks/non-existent-id/step-done")
    assert missing_step.status_code == 404


