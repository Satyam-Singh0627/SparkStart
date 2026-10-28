"""
Privacy & Data Sovereignty Routes
Export local data or completely purge local database.
"""

from fastapi import APIRouter
from services.api.storage.repository import repository

router = APIRouter(prefix="/privacy", tags=["Privacy"])


@router.get("/export")
async def export_data():
    return repository.export_all()


@router.post("/purge")
async def purge_all_data():
    repository.purge_all()
    return {
        "purged": True,
        "message": "All local tasks, micro-tasks, and stored preferences have been permanently deleted.",
    }

