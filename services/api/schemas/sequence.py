"""
Sequencing Request and Response Models
"""

from typing import Optional, List
from pydantic import BaseModel, Field
from .task import KnowledgeSourceRef


class SequenceRequest(BaseModel):
    taskId: Optional[str] = None
    taskTitle: str = Field(..., min_length=1, max_length=500)
    taskDescription: Optional[str] = None
    energyLevel: Optional[str] = "unsure"
    currentStepText: Optional[str] = None
    previousStepCompleted: Optional[bool] = False
    preferredDurationMinutes: Optional[int] = 5
    obstacle: Optional[str] = None


class SequenceResponse(BaseModel):
    taskId: Optional[str] = None
    stepId: Optional[str] = None
    stepOrder: Optional[int] = None
    totalSteps: Optional[int] = None
    actionText: str
    suggestedDurationMinutes: int
    encouragement: str
    whyItIsManageable: str
    alternativeSmallerStep: str
    sourceReferences: List[KnowledgeSourceRef] = Field(default_factory=list)
    isFallback: bool = False
    timestamp: str


class ShrinkRequest(BaseModel):
    taskId: Optional[str] = None
    taskTitle: str
    currentActionText: str
    energyLevel: Optional[str] = "low"
    obstacle: Optional[str] = None


class RestTimerRequest(BaseModel):
    durationMinutes: int = Field(default=5, ge=1, le=60)
    reason: Optional[str] = "Pacing reset"

