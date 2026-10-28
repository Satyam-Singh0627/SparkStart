"""
Abstract Base Class for AI Providers in SparkStart
Enforces consistent interface and schema-validated structured responses.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List


class BaseAIProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Name of the provider, e.g. 'mock', 'gemini', 'openai'."""
        pass

    @abstractmethod
    async def generate_micro_step(
        self,
        task_title: str,
        energy_level: str,
        obstacle: str | None,
        retrieved_context: str,
        is_shrink_request: bool = False,
        current_step_text: str | None = None,
    ) -> Dict[str, Any]:
        """
        Generate a validated micro-task JSON dictionary matching the SequenceResponse schema:
        {
            "actionText": str,
            "suggestedDurationMinutes": int,
            "encouragement": str,
            "whyItIsManageable": str,
            "alternativeSmallerStep": str
        }
        """
        pass

    @abstractmethod
    async def generate_task_plan(
        self,
        task_title: str,
        energy_level: str,
        retrieved_context: str = "",
    ) -> List[Dict[str, Any]]:
        """
        Generate an ordered list of 3 to 4 sequential micro-steps decomposing the task:
        [
            {
                "stepOrder": int,
                "actionText": str,
                "suggestedDurationMinutes": int,
                "encouragement": str,
                "whyItIsManageable": str,
                "alternativeSmallerStep": str
            }, ...
        ]
        """
        pass

