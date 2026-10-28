"""
User Preferences Schema
"""

from typing import Optional
from pydantic import BaseModel, Field


class PreferencesSchema(BaseModel):
    defaultEnergy: str = Field(default="unsure")
    preferredStepDurationMinutes: int = Field(default=5, ge=1, le=60)
    enableSparkBuddy: bool = True
    enableDesktopNotifications: bool = True
    reminderFrequencyMinutes: int = Field(default=30, ge=5, le=180)
    quietHoursStart: str = "22:00"
    quietHoursEnd: str = "08:00"
    globalPause: bool = False
    enableRemoteAI: bool = False
    aiProvider: str = "mock"
    reducedMotion: bool = False
    theme: str = "light"
    character: str = "sprout"
