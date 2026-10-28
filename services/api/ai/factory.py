"""
AI Provider Factory
Resolves the configured AI provider while respecting privacy flags and key availability.
"""

from services.api.config import settings
from services.api.ai.base import BaseAIProvider
from services.api.ai.mock_provider import MockAIProvider
from services.api.ai.gemini_provider import GeminiAIProvider
from services.api.ai.openai_provider import OpenAIProvider


def get_ai_provider() -> BaseAIProvider:
    # If remote AI is disabled by privacy setting, force MockAIProvider for 100% local operation
    if not settings.enable_remote_ai:
        return MockAIProvider()

    provider_choice = settings.ai_provider.lower()
    if provider_choice == "gemini" and settings.gemini_api_key:
        return GeminiAIProvider(settings.gemini_api_key)
    elif provider_choice == "openai" and settings.openai_api_key:
        return OpenAIProvider(settings.openai_api_key)

    # Default offline mock provider
    return MockAIProvider()

