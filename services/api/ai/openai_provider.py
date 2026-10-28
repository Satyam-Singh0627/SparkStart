"""
OpenAI Provider for SparkStart
Uses httpx with JSON mode and fallback to local mock provider.
"""

import json
import logging
import httpx
from typing import Dict, Any

from services.api.ai.base import BaseAIProvider
from services.api.ai.mock_provider import MockAIProvider

logger = logging.getLogger(__name__)


class OpenAIProvider(BaseAIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.fallback = MockAIProvider()

    @property
    def provider_name(self) -> str:
        return "openai"

    async def generate_micro_step(
        self,
        task_title: str,
        energy_level: str,
        obstacle: str | None,
        retrieved_context: str,
        is_shrink_request: bool = False,
        current_step_text: str | None = None,
    ) -> Dict[str, Any]:
        prompt = f"""
You are the SparkStart Task Sequencer. Provide ONE single micro-step.
Task: {task_title}
Energy: {energy_level}
Obstacle: {obstacle or 'None'}
Shrink Request: {is_shrink_request}
Prior step: {current_step_text or 'None'}

Retrieved Literature:
{retrieved_context}

Respond in strict JSON with keys: actionText, suggestedDurationMinutes (int), encouragement, whyItIsManageable, alternativeSmallerStep.
"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a gentle, evidence-based micro-step sequencer. Output valid JSON."},
                {"role": "user", "content": prompt},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.3,
            "max_tokens": 400,
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    parsed = json.loads(content)
                    if all(k in parsed for k in ["actionText", "suggestedDurationMinutes", "encouragement"]):
                        return parsed
                logger.warning(f"OpenAI call returned status {res.status_code}. Using local fallback.")
        except Exception as e:
            logger.warning(f"OpenAI call exception: {e}. Using local fallback.")

        return await self.fallback.generate_micro_step(
            task_title, energy_level, obstacle, retrieved_context, is_shrink_request, current_step_text
        )

