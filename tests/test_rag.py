"""
Comprehensive RAG Engine & Knowledge Base Test Suite for SparkStart
Verifies document ingestion, TF-IDF vector space modeling, cosine similarity retrieval,
semantic relevance, attribution citations, and graceful fallback on empty/irrelevant corpora.
"""

import json
import pytest
from pathlib import Path
from fastapi.testclient import TestClient

from services.api.main import app
from services.api.rag.engine import RAGEngine, RAGChunk
from services.api.config import settings

client = TestClient(app)


def test_rag_knowledge_file_integrity():
    """Verify source JSON file exists, is valid JSON, and has rich clinical sources."""
    assert settings.rag_knowledge_path.exists(), f"Missing {settings.rag_knowledge_path}"
    with open(settings.rag_knowledge_path, "r", encoding="utf-8") as f:
        sources = json.load(f)

    assert isinstance(sources, list)
    assert len(sources) >= 5, "Expected at least 5 primary psychological knowledge sources"

    for s in sources:
        assert "id" in s
        assert "title" in s
        assert "authors" in s
        assert "chunks" in s
        assert len(s["chunks"]) > 0


def test_rag_engine_indexing_and_vectorization():
    """Verify RAGEngine correctly computes tokens, IDF weights, and unit norm TF-IDF vectors."""
    engine = RAGEngine(settings.rag_knowledge_path)
    assert len(engine.chunks) >= 10, f"Expected >= 10 chunks, got {len(engine.chunks)}"
    assert len(engine.idf) > 0, "IDF vocabulary must not be empty"

    # Verify every chunk has a non-empty vector and normalized weights
    for chunk in engine.chunks:
        assert isinstance(chunk.vector, dict)
        assert len(chunk.vector) > 0
        norm_sq = sum(v * v for v in chunk.vector.values())
        # Cosine unit length is approx 1.0 (within float tolerance)
        assert abs(norm_sq - 1.0) < 0.05, f"Vector for chunk {chunk.chunk_id} should be normalized"


def test_rag_relevant_query_retrieval():
    """Verify querying for known concepts returns high-similarity, topically accurate sources."""
    engine = RAGEngine(settings.rag_knowledge_path)

    # 1. Query: "activation energy and starting resistance"
    res1 = engine.search("activation energy starting resistance", top_k=2)
    assert len(res1) == 2
    top_chunk, score = res1[0]
    assert score > 0.1
    # Should match Gollwitzer or Clear or similar activation energy guidance
    assert any(term in top_chunk.text.lower() or term in " ".join(top_chunk.keywords).lower()
               for term in ["activation", "resistance", "friction", "starting", "initiation"])

    # 2. Query: "cognitive load working memory overload"
    res2 = engine.search("cognitive load working memory overload", top_k=2)
    assert len(res2) == 2
    top_chunk2, score2 = res2[0]
    assert score2 > 0.1
    assert "cognitive" in top_chunk2.text.lower() or "working memory" in top_chunk2.text.lower()

    # 3. Query: "guilt free rest break recovery"
    res3 = engine.search("guilt free rest break recovery", top_k=2)
    assert len(res3) == 2
    top_chunk3, score3 = res3[0]
    assert score3 > 0.1
    assert "rest" in top_chunk3.text.lower() or "recovery" in top_chunk3.text.lower()


def test_rag_irrelevant_query_graceful_handling():
    """Verify querying for completely irrelevant nonsense returns low baseline without crashing."""
    engine = RAGEngine(settings.rag_knowledge_path)
    res = engine.search("qwertyuiop asdfghjkl zxcvbnm completely unrelated gibberish 9999", top_k=3)
    assert len(res) == 3
    # Top score should be minimal (near 0) since no term matches vocabulary
    assert res[0][1] < 0.05


def test_rag_empty_corpus_handling(tmp_path: Path):
    """Verify RAGEngine handles empty file or non-existent path cleanly."""
    empty_path = tmp_path / "empty_knowledge.json"
    empty_path.write_text("[]", encoding="utf-8")

    engine = RAGEngine(empty_path)
    assert len(engine.chunks) == 0
    assert engine.search("test query") == []
    assert engine.format_retrieval_context([]) == "No specific literature retrieved."


def test_rag_formatted_context():
    """Verify generated context contains readable citations and topics."""
    engine = RAGEngine(settings.rag_knowledge_path)
    results = engine.search("task paralysis executive dysfunction", top_k=2)
    context_str = engine.format_retrieval_context(results)
    assert "[" in context_str and "]" in context_str
    assert "Topic:" in context_str
    assert "Guidance:" in context_str


def test_rag_api_endpoints():
    """Verify /api/knowledge and /api/knowledge/search REST endpoints."""
    # List sources
    get_res = client.get("/api/knowledge")
    assert get_res.status_code == 200
    sources = get_res.json()
    assert len(sources) >= 5

    # Search endpoint
    search_res = client.post(
        "/api/knowledge/search",
        json={"query": "dopamine baseline recovery pause", "topK": 2},
    )
    assert search_res.status_code == 200
    data = search_res.json()
    assert "results" in data
    assert len(data["results"]) == 2
    assert "sourceTitle" in data["results"][0]
    assert "text" in data["results"][0]
