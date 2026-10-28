"""
Data Repository Implementation
Provides local SQLite persistence for tasks, micro-tasks, preferences, and privacy purges.
"""

import json
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any

from services.api.storage.database import get_db_connection
from services.api.schemas.task import TaskCreate, TaskUpdate, TaskResponse, MicroTaskResponse, KnowledgeSourceRef
from services.api.schemas.preferences import PreferencesSchema


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class LocalRepository:
    def __init__(self, db_path=None):
        self.db_path = db_path

    def _conn(self):
        return get_db_connection(self.db_path)

    # -------------------------------------------------------------
    # TASKS
    # -------------------------------------------------------------
    def create_task(self, task_in: TaskCreate) -> TaskResponse:
        task_id = str(uuid.uuid4())
        now = _now_iso()
        conn = self._conn()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO tasks (id, title, description, energy, status, deadline, completed_steps_count, total_steps_count, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'todo', ?, 0, 0, ?, ?)
            """,
            (task_id, task_in.title, task_in.description, task_in.energy or "unsure", task_in.deadline, now, now),
        )
        conn.commit()
        conn.close()

        # Automatically decompose parent task into concrete micro-steps
        self.auto_decompose_task(task_id, task_in.title, task_in.energy or "unsure")
        return self.get_task(task_id)

    def auto_decompose_task(self, task_id: str, title: str, energy: str) -> List[MicroTaskResponse]:
        from services.api.ai.mock_provider import MockAIProvider
        provider = MockAIProvider()
        import asyncio
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None

        if loop and loop.is_running():
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as executor:
                steps_data = executor.submit(lambda: asyncio.run(provider.generate_task_plan(title, energy))).result()
        else:
            steps_data = asyncio.run(provider.generate_task_plan(title, energy))

        conn = self._conn()
        cursor = conn.cursor()
        now = _now_iso()
        for idx, s in enumerate(steps_data, start=1):
            m_id = str(uuid.uuid4())
            try:
                cursor.execute(
                    """
                    INSERT INTO micro_tasks (
                        id, task_id, action_text, suggested_duration_minutes, status, step_order,
                        encouragement, why_manageable, alternative_step, source_refs_json, is_fallback, created_at
                    )
                    VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, '[]', 1, ?)
                    """,
                    (
                        m_id,
                        task_id,
                        s["actionText"],
                        int(s["suggestedDurationMinutes"]),
                        idx,
                        s.get("encouragement", "Small steps."),
                        s.get("whyItIsManageable", "Manageable starting action."),
                        s.get("alternativeSmallerStep", ""),
                        now,
                    ),
                )
            except Exception:
                cursor.execute(
                    """
                    INSERT INTO micro_tasks (
                        id, task_id, action_text, suggested_duration_minutes, status,
                        encouragement, why_manageable, alternative_step, source_refs_json, is_fallback, created_at
                    )
                    VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, '[]', 1, ?)
                    """,
                    (
                        m_id,
                        task_id,
                        s["actionText"],
                        int(s["suggestedDurationMinutes"]),
                        s.get("encouragement", "Small steps."),
                        s.get("whyItIsManageable", "Manageable starting action."),
                        s.get("alternativeSmallerStep", ""),
                        now,
                    ),
                )
        try:
            cursor.execute("UPDATE tasks SET total_steps_count = ? WHERE id = ?", (len(steps_data), task_id))
        except Exception:
            pass
        conn.commit()
        conn.close()
        return self.get_subtasks(task_id)

    def get_subtasks(self, task_id: str) -> List[MicroTaskResponse]:
        conn = self._conn()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "SELECT * FROM micro_tasks WHERE task_id = ? ORDER BY step_order ASC, created_at ASC",
                (task_id,),
            )
        except Exception:
            cursor.execute(
                "SELECT * FROM micro_tasks WHERE task_id = ? ORDER BY created_at ASC",
                (task_id,),
            )
        rows = cursor.fetchall()
        conn.close()

        subtasks = []
        for idx, m_row in enumerate(rows, start=1):
            source_refs = []
            if m_row["source_refs_json"]:
                try:
                    refs_data = json.loads(m_row["source_refs_json"])
                    source_refs = [KnowledgeSourceRef(**ref) for ref in refs_data]
                except Exception:
                    pass

            step_order = idx
            try:
                step_order = m_row["step_order"] if m_row["step_order"] is not None else idx
            except Exception:
                pass

            subtasks.append(
                MicroTaskResponse(
                    id=m_row["id"],
                    taskId=m_row["task_id"],
                    actionText=m_row["action_text"],
                    suggestedDurationMinutes=m_row["suggested_duration_minutes"],
                    status=m_row["status"],
                    stepOrder=step_order,
                    encouragement=m_row["encouragement"],
                    whyItIsManageable=m_row["why_manageable"],
                    alternativeSmallerStep=m_row["alternative_step"],
                    sourceReferences=source_refs,
                    isFallback=bool(m_row["is_fallback"]),
                    createdAt=m_row["created_at"],
                )
            )
        return subtasks

    def get_task(self, task_id: str) -> Optional[TaskResponse]:
        conn = self._conn()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None

        subtasks = self.get_subtasks(task_id)
        if not subtasks and row["status"] != "completed":
            subtasks = self.auto_decompose_task(task_id, row["title"], row["energy"] or "unsure")

        completed_count = sum(1 for s in subtasks if s.status == "completed")
        total_count = len(subtasks)

        # Identify the next active incomplete step
        active_step = None
        for s in subtasks:
            if s.status != "completed":
                active_step = s
                break

        status = row["status"]
        if total_count > 0 and completed_count >= total_count:
            if status != "completed":
                status = "completed"
                conn = self._conn()
                conn.cursor().execute(
                    "UPDATE tasks SET status = 'completed', completed_steps_count = ? WHERE id = ?",
                    (completed_count, task_id),
                )
                conn.commit()
                conn.close()
        elif completed_count > 0 and status == "todo":
            status = "in_progress"

        return TaskResponse(
            id=row["id"],
            title=row["title"],
            description=row["description"],
            energy=row["energy"],
            status=status,
            deadline=row["deadline"],
            completedStepsCount=completed_count,
            totalStepsCount=total_count,
            subtasks=subtasks,
            createdAt=row["created_at"],
            updatedAt=row["updated_at"],
            currentMicroTask=active_step,
        )

    def list_tasks(self, status: Optional[str] = None) -> List[TaskResponse]:
        conn = self._conn()
        cursor = conn.cursor()
        if status:
            cursor.execute("SELECT id FROM tasks WHERE status = ? ORDER BY updated_at DESC", (status,))
        else:
            cursor.execute("SELECT id FROM tasks ORDER BY updated_at DESC")
        rows = cursor.fetchall()
        conn.close()

        tasks = []
        for r in rows:
            t = self.get_task(r["id"])
            if t:
                tasks.append(t)
        return tasks

    def update_task(self, task_id: str, updates: TaskUpdate) -> Optional[TaskResponse]:
        conn = self._conn()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        if not cursor.fetchone():
            conn.close()
            return None

        fields = []
        values = []
        if updates.title is not None:
            fields.append("title = ?")
            values.append(updates.title)
        if updates.description is not None:
            fields.append("description = ?")
            values.append(updates.description)
        if updates.energy is not None:
            fields.append("energy = ?")
            values.append(updates.energy)
        if updates.status is not None:
            fields.append("status = ?")
            values.append(updates.status)
        if updates.deadline is not None:
            fields.append("deadline = ?")
            values.append(updates.deadline)

        fields.append("updated_at = ?")
        values.append(_now_iso())
        values.append(task_id)

        sql = f"UPDATE tasks SET {', '.join(fields)} WHERE id = ?"
        cursor.execute(sql, tuple(values))
        conn.commit()
        conn.close()
        return self.get_task(task_id)

    def increment_completed_steps(self, task_id: str, step_id: Optional[str] = None) -> Optional[TaskResponse]:
        conn = self._conn()
        cursor = conn.cursor()
        now = _now_iso()

        # Check if task exists
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        if not cursor.fetchone():
            conn.close()
            return None

        # 1. Mark specific or first incomplete subtask as completed
        if step_id:
            cursor.execute(
                "UPDATE micro_tasks SET status = 'completed' WHERE id = ? AND task_id = ?",
                (step_id, task_id),
            )
        else:
            try:
                cursor.execute(
                    "SELECT id FROM micro_tasks WHERE task_id = ? AND status != 'completed' ORDER BY step_order ASC, created_at ASC LIMIT 1",
                    (task_id,),
                )
            except Exception:
                cursor.execute(
                    "SELECT id FROM micro_tasks WHERE task_id = ? AND status != 'completed' ORDER BY created_at ASC LIMIT 1",
                    (task_id,),
                )
            row = cursor.fetchone()
            if row:
                cursor.execute(
                    "UPDATE micro_tasks SET status = 'completed' WHERE id = ?",
                    (row["id"],),
                )

        # 2. Count completed and total steps
        cursor.execute(
            "SELECT COUNT(*) as c FROM micro_tasks WHERE task_id = ? AND status = 'completed'",
            (task_id,),
        )
        completed_count = cursor.fetchone()["c"]

        cursor.execute(
            "SELECT COUNT(*) as total FROM micro_tasks WHERE task_id = ?",
            (task_id,),
        )
        total_count = cursor.fetchone()["total"]

        # Ensure completed_count is at least incremented if no subtasks existed
        if total_count == 0:
            cursor.execute("SELECT completed_steps_count FROM tasks WHERE id = ?", (task_id,))
            prev = cursor.fetchone()["completed_steps_count"] or 0
            completed_count = prev + 1

        new_status = "completed" if (total_count > 0 and completed_count >= total_count) else "in_progress"

        try:
            cursor.execute(
                """
                UPDATE tasks
                SET completed_steps_count = ?,
                    total_steps_count = ?,
                    status = ?,
                    updated_at = ?
                WHERE id = ?
                """,
                (completed_count, total_count, new_status, now, task_id),
            )
        except Exception:
            cursor.execute(
                """
                UPDATE tasks
                SET completed_steps_count = ?,
                    status = ?,
                    updated_at = ?
                WHERE id = ?
                """,
                (completed_count, new_status, now, task_id),
            )
        conn.commit()
        conn.close()
        return self.get_task(task_id)

    def reopen_task(self, task_id: str) -> Optional[TaskResponse]:
        conn = self._conn()
        cursor = conn.cursor()
        now = _now_iso()

        # Check if task exists
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        if not cursor.fetchone():
            conn.close()
            return None

        # Reopen the last completed subtask so user can continue
        try:
            cursor.execute(
                """
                UPDATE micro_tasks SET status = 'pending' WHERE id IN (
                    SELECT id FROM micro_tasks WHERE task_id = ? ORDER BY step_order DESC, created_at DESC LIMIT 1
                )
                """,
                (task_id,),
            )
        except Exception:
            pass

        cursor.execute(
            "SELECT COUNT(*) as c FROM micro_tasks WHERE task_id = ? AND status = 'completed'",
            (task_id,),
        )
        comp = cursor.fetchone()["c"]

        cursor.execute(
            "UPDATE tasks SET status = 'in_progress', completed_steps_count = ?, updated_at = ? WHERE id = ?",
            (comp, now, task_id),
        )
        conn.commit()
        conn.close()
        return self.get_task(task_id)

    def delete_task(self, task_id: str) -> bool:
        conn = self._conn()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM micro_tasks WHERE task_id = ?", (task_id,))
        cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return deleted

    # -------------------------------------------------------------
    # MICRO-TASKS
    # -------------------------------------------------------------
    def save_micro_task(
        self,
        task_id: str,
        action_text: str,
        suggested_duration_minutes: int,
        encouragement: str,
        why_manageable: str,
        alternative_step: str,
        source_refs: List[Dict[str, Any]],
        is_fallback: bool = False,
    ) -> MicroTaskResponse:
        conn = self._conn()
        cursor = conn.cursor()
        micro_id = str(uuid.uuid4())
        now = _now_iso()

        # Archive any previous suggested microtasks for this task
        cursor.execute(
            "UPDATE micro_tasks SET status = 'superseded' WHERE task_id = ? AND status = 'suggested'",
            (task_id,),
        )

        cursor.execute(
            """
            INSERT INTO micro_tasks (
                id, task_id, action_text, suggested_duration_minutes, status,
                encouragement, why_manageable, alternative_step, source_refs_json, is_fallback, created_at
            )
            VALUES (?, ?, ?, ?, 'suggested', ?, ?, ?, ?, ?, ?)
            """,
            (
                micro_id,
                task_id,
                action_text,
                suggested_duration_minutes,
                encouragement,
                why_manageable,
                alternative_step,
                json.dumps(source_refs),
                1 if is_fallback else 0,
                now,
            ),
        )
        # Also touch task updated_at
        cursor.execute("UPDATE tasks SET updated_at = ? WHERE id = ?", (now, task_id))
        conn.commit()
        conn.close()

        typed_refs = [KnowledgeSourceRef(**ref) for ref in source_refs]
        return MicroTaskResponse(
            id=micro_id,
            taskId=task_id,
            actionText=action_text,
            suggestedDurationMinutes=suggested_duration_minutes,
            status="suggested",
            encouragement=encouragement,
            whyItIsManageable=why_manageable,
            alternativeSmallerStep=alternative_step,
            sourceReferences=typed_refs,
            isFallback=is_fallback,
            createdAt=now,
        )

    def update_micro_task_status(self, micro_id: str, status: str) -> bool:
        conn = self._conn()
        cursor = conn.cursor()
        cursor.execute("UPDATE micro_tasks SET status = ? WHERE id = ?", (status, micro_id))
        success = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return success

    # -------------------------------------------------------------
    # PREFERENCES
    # -------------------------------------------------------------
    def get_preferences(self) -> PreferencesSchema:
        conn = self._conn()
        cursor = conn.cursor()
        cursor.execute("SELECT preferences_json FROM preferences WHERE id = 'default'")
        row = cursor.fetchone()
        conn.close()
        if not row:
            return PreferencesSchema()
        try:
            data = json.loads(row["preferences_json"])
            return PreferencesSchema(**data)
        except Exception:
            return PreferencesSchema()

    def save_preferences(self, prefs: PreferencesSchema) -> PreferencesSchema:
        conn = self._conn()
        cursor = conn.cursor()
        now = _now_iso()
        prefs_json = json.dumps(prefs.model_dump())
        cursor.execute(
            """
            INSERT INTO preferences (id, preferences_json, updated_at)
            VALUES ('default', ?, ?)
            ON CONFLICT(id) DO UPDATE SET preferences_json = excluded.preferences_json, updated_at = excluded.updated_at
            """,
            (prefs_json, now),
        )
        conn.commit()
        conn.close()
        return prefs

    # -------------------------------------------------------------
    # PRIVACY CONTROLS: EXPORT & PURGE
    # -------------------------------------------------------------
    def export_all(self) -> Dict[str, Any]:
        tasks = self.list_tasks()
        prefs = self.get_preferences()
        return {
            "exportedAt": _now_iso(),
            "formatVersion": "1.0",
            "preferences": prefs.model_dump(),
            "tasks": [t.model_dump() for t in tasks],
        }

    def purge_all(self) -> bool:
        conn = self._conn()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM micro_tasks")
        cursor.execute("DELETE FROM tasks")
        cursor.execute("DELETE FROM preferences")
        conn.commit()
        conn.close()
        return True


repository = LocalRepository()

