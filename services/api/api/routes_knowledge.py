"""
Knowledge Base & RAG Query Routes
Exposes curated evidence-conscious sources and semantic search.
"""

from typing import List, Dict, Any
from fastapi import APIRouter
from services.api.rag.engine import rag_engine
from services.api.schemas.knowledge import KnowledgeSourceSchema, KnowledgeSearchQuery

router = APIRouter(prefix="/knowledge", tags=["Knowledge"])


@router.get("", response_model=List[KnowledgeSourceSchema])
async def get_all_sources():
    return [KnowledgeSourceSchema(**source) for source in rag_engine.raw_sources]


@router.post("/search")
async def search_knowledge(query: KnowledgeSearchQuery):
    results = rag_engine.search(query.query, top_k=query.topK or 3)
    output = []
    for chunk, score in results:
        data = chunk.to_dict()
        data["similarityScore"] = round(score, 3)
        output.append(data)
    return {
        "query": query.query,
        "results": output,
    }

