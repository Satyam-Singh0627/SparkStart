"""
Health & Diagnostic Endpoints
"""

from fastapi import APIRouter
from services.api.config import settings
from services.api.rag.engine import rag_engine
from services.api.ai.factory import get_ai_provider

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    provider = get_ai_provider()
    return {
        "status": "healthy",
        "service": "SparkStart Task Sequencer API",
        "version": "1.0.0",
        "aiProvider": provider.provider_name,
        "remoteAIEnabled": settings.enable_remote_ai,
        "indexedKnowledgeChunks": len(rag_engine.chunks),
        "databaseConfigured": settings.db_path.name,
    }

