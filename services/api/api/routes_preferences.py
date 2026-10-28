"""
User Preferences Routes
"""

from fastapi import APIRouter
from services.api.schemas.preferences import PreferencesSchema
from services.api.storage.repository import repository

router = APIRouter(prefix="/preferences", tags=["Preferences"])


@router.get("", response_model=PreferencesSchema)
async def get_preferences():
    return repository.get_preferences()


@router.put("", response_model=PreferencesSchema)
async def update_preferences(prefs: PreferencesSchema):
    return repository.save_preferences(prefs)

