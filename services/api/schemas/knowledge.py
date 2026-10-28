"""
Knowledge Source Schemas
"""

from typing import List, Optional
from pydantic import BaseModel


class KnowledgeChunkSchema(BaseModel):
    chunkId: str
    topic: str
    text: str
    keywords: List[str] = []


class KnowledgeSourceSchema(BaseModel):
    id: str
    title: str
    authors: str
    year: int
    publication: str
    url: Optional[str] = None
    category: str
    chunks: List[KnowledgeChunkSchema] = []


class KnowledgeSearchQuery(BaseModel):
    query: str
    topK: Optional[int] = 3

