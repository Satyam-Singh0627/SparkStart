"""
Task & Micro-task Pydantic Schemas
"""

from typing import Optional, List
from pydantic import BaseModel, Field, field_validator


class KnowledgeSourceRef(BaseModel):
    id: str
    title: str
    sourceUrl: Optional[str] = None
    excerpt: Optional[str] = None


class MicroTaskResponse(BaseModel):
    id: str
    taskId: str
    actionText: str
    suggestedDurationMinutes: int
    status: str
    stepOrder: Optional[int] = 1
    encouragement: str
    whyItIsManageable: str
    alternativeSmallerStep: Optional[str] = None
    sourceReferences: List[KnowledgeSourceRef] = Field(default_factory=list)
    isFallback: bool = False
    createdAt: str


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    description: Optional[str] = Field(None, max_length=2000)
    energy: Optional[str] = Field(default="unsure")
    deadline: Optional[str] = None

    @field_validator("title")
    @classmethod
    def validate_title_not_empty(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Task title cannot be empty or whitespace only")
        return stripped


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    description: Optional[str] = None
    energy: Optional[str] = None
    status: Optional[str] = None
    deadline: Optional[str] = None

    @field_validator("title")
    @classmethod
    def validate_title_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            stripped = v.strip()
            if not stripped:
                raise ValueError("Task title cannot be empty or whitespace only")
            return stripped
        return v


class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    energy: Optional[str] = "unsure"
    status: str = "todo"
    deadline: Optional[str] = None
    completedStepsCount: int = 0
    totalStepsCount: int = 0
    subtasks: List[MicroTaskResponse] = Field(default_factory=list)
    createdAt: str
    updatedAt: str
    currentMicroTask: Optional[MicroTaskResponse] = None

