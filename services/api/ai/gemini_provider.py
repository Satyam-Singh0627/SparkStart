"""
Google Gemini AI Provider for SparkStart
Uses httpx to interact with Gemini API endpoint with structured JSON mode and timeout guards.
"""

import json
import logging
import httpx
from typing import Dict, Any

from services.api.ai.base import BaseAIProvider
from services.api.ai.mock_provider import MockAIProvider

logger = logging.getLogger(__name__)


class GeminiAIProvider(BaseAIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.fallback = MockAIProvider()

    @property
    def provider_name(self) -> str:
        return "gemini"

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
You are the SparkStart Task Sequencer, an empathetic, evidence-based productivity companion.
Your goal is to break down a user's task into ONE single, ultra-manageable, friction-free next micro-step.
Do NOT create a long plan or intimidating checklist. Give ONLY the immediate next action.

USER CONTEXT:
- Task: {task_title}
- Energy Level: {energy_level} (low/medium/high/unsure)
- Obstacle / Fear: {obstacle or 'None specified'}
- Is 'Too Big' shrink request: {is_shrink_request}
- Previous step attempted: {current_step_text or 'None'}

EVIDENCE-BASED RETRIEVED GUIDANCE:
{retrieved_context}

RULES:
1. Low energy means 2 to 3 minutes MAXIMUM. High energy means 10 to 15 minutes.
2. The action must be specific, sensory, and observable (e.g. 'open file and read sentence 1').
3. Voice must be non-judgmental, warm, calm, and respectful of autonomy. No toxic positivity.
4. If this is a shrink request, make it genuinely smaller (e.g. 1 minute, physical contact only).

Respond STRICTLY with a valid JSON object matching this schema:
{{
  "actionText": "string describing the single next action",
  "suggestedDurationMinutes": integer,
  "encouragement": "short supportive sentence",
  "whyItIsManageable": "brief explanation of why this reduces activation friction",
  "alternativeSmallerStep": "even smaller fallback if still too hard"
}}
"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.4,
                "max_output_tokens": 500,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text_response = candidates[0]["content"]["parts"][0]["text"]
                        parsed = json.loads(text_response)
                        # Validate required keys
                        if all(k in parsed for k in ["actionText", "suggestedDurationMinutes", "encouragement", "whyItIsManageable"]):
                            return parsed
                logger.warning(f"Gemini API returned status {res.status_code}: {res.text}. Falling back to mock provider.")
        except Exception as e:
            logger.warning(f"Gemini API call failed with exception: {e}. Falling back to local mock provider.")

        # Seamless local fallback
        return await self.fallback.generate_micro_step(
            task_title, energy_level, obstacle, retrieved_context, is_shrink_request, current_step_text
        )

    async def generate_task_plan(
        self,
        task_title: str,
        energy_level: str,
        retrieved_context: str = "",
    ) -> list[Dict[str, Any]]:
        return await self.fallback.generate_task_plan(task_title, energy_level, retrieved_context)

