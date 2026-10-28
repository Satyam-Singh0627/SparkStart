"""
Task Management API Routes
CRUD operations with zero shame/punitive mechanics.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

from services.api.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from services.api.storage.repository import repository

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("", response_model=TaskResponse)
async def create_task(task_in: TaskCreate):
    return repository.create_task(task_in)


@router.get("", response_model=List[TaskResponse])
async def list_tasks(status: Optional[str] = Query(None)):
    return repository.list_tasks(status=status)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    task = repository.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, updates: TaskUpdate):
    task = repository.update_task(task_id, updates)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/{task_id}")
async def delete_task(task_id: str):
    deleted = repository.delete_task(task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"deleted": True, "taskId": task_id}


@router.post("/{task_id}/step-done", response_model=TaskResponse)
async def mark_step_done(task_id: str):
    task = repository.increment_completed_steps(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

