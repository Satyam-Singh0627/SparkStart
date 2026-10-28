"""
Lightweight RAG Engine for SparkStart
Loads curated psychological & productivity knowledge, builds vector representations,
and retrieves grounded evidence-based context for micro-task sequencing.
"""

import json
import math
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple


class RAGChunk:
    def __init__(
        self,
        chunk_id: str,
        source_id: str,
        source_title: str,
        authors: str,
        publication: str,
        source_url: str | None,
        topic: str,
        text: str,
        keywords: List[str],
    ):
        self.chunk_id = chunk_id
        self.source_id = source_id
        self.source_title = source_title
        self.authors = authors
        self.publication = publication
        self.source_url = source_url
        self.topic = topic
        self.text = text
        self.keywords = keywords
        self.vector: Dict[str, float] = {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "chunkId": self.chunk_id,
            "sourceId": self.source_id,
            "sourceTitle": self.source_title,
            "authors": self.authors,
            "publication": self.publication,
            "sourceUrl": self.source_url,
            "topic": self.topic,
            "text": self.text,
            "keywords": self.keywords,
        }


class RAGEngine:
    def __init__(self, knowledge_path: Path):
        self.knowledge_path = knowledge_path
        self.chunks: List[RAGChunk] = []
        self.raw_sources: List[Dict[str, Any]] = []
        self.idf: Dict[str, float] = {}
        self.load_and_index()

    def _tokenize(self, text: str) -> List[str]:
        # Lowercase and extract alphanumeric words
        words = re.findall(r"\b[a-zA-Z0-9_-]{2,}\b", text.lower())
        stopwords = {
            "the", "and", "for", "with", "that", "this", "from", "are", "have", "not",
            "you", "your", "can", "but", "about", "all", "also", "into", "more", "other",
            "some", "such", "than", "them", "then", "there", "these", "they", "was", "will"
        }
        return [w for w in words if w not in stopwords]

    def load_and_index(self):
        self.chunks = []
        self.raw_sources = []
        if not self.knowledge_path.exists():
            return

        with open(self.knowledge_path, "r", encoding="utf-8") as f:
            self.raw_sources = json.load(f)

        for source in self.raw_sources:
            s_id = source.get("id", "")
            s_title = source.get("title", "")
            authors = source.get("authors", "")
            pub = source.get("publication", "")
            s_url = source.get("url")

            for chunk_data in source.get("chunks", []):
                chunk = RAGChunk(
                    chunk_id=chunk_data.get("chunkId", f"{s_id}-{len(self.chunks)}"),
                    source_id=s_id,
                    source_title=s_title,
                    authors=authors,
                    publication=pub,
                    source_url=s_url,
                    topic=chunk_data.get("topic", ""),
                    text=chunk_data.get("text", ""),
                    keywords=chunk_data.get("keywords", []),
                )
                self.chunks.append(chunk)

        # Compute IDF
        total_docs = len(self.chunks)
        if total_docs == 0:
            return

        df: Dict[str, int] = {}
        for chunk in self.chunks:
            tokens = set(self._tokenize(chunk.text + " " + chunk.topic + " " + " ".join(chunk.keywords)))
            for token in tokens:
                df[token] = df.get(token, 0) + 1

        self.idf = {term: math.log((1 + total_docs) / (1 + count)) + 1.0 for term, count in df.items()}

        # Compute TF-IDF vectors
        for chunk in self.chunks:
            full_text = f"{chunk.text} {chunk.topic} {' '.join(chunk.keywords)}"
            tokens = self._tokenize(full_text)
            tf: Dict[str, float] = {}
            for t in tokens:
                tf[t] = tf.get(t, 0) + 1.0

            # Boost explicit keywords
            for kw in chunk.keywords:
                for kt in self._tokenize(kw):
                    tf[kt] = tf.get(kt, 0) + 2.5

            norm = 0.0
            vector = {}
            for t, count in tf.items():
                tfidf = (count / len(tokens)) * self.idf.get(t, 1.0)
                vector[t] = tfidf
                norm += tfidf * tfidf

            norm = math.sqrt(norm) or 1.0
            chunk.vector = {t: val / norm for t, val in vector.items()}

    def search(self, query: str, top_k: int = 3) -> List[Tuple[RAGChunk, float]]:
        if not self.chunks:
            return []

        q_tokens = self._tokenize(query)
        if not q_tokens:
            return [(c, 0.5) for c in self.chunks[:top_k]]

        q_tf: Dict[str, float] = {}
        for t in q_tokens:
            q_tf[t] = q_tf.get(t, 0) + 1.0

        q_norm = 0.0
        q_vector = {}
        for t, count in q_tf.items():
            tfidf = (count / len(q_tokens)) * self.idf.get(t, 1.0)
            q_vector[t] = tfidf
            q_norm += tfidf * tfidf

        q_norm = math.sqrt(q_norm) or 1.0
        q_vector = {t: val / q_norm for t, val in q_vector.items()}

        scores: List[Tuple[RAGChunk, float]] = []
        for chunk in self.chunks:
            # Cosine similarity dot product
            dot = sum(val * chunk.vector.get(t, 0.0) for t, val in q_vector.items())
            # Add bonus for direct keyword match
            for q_term in q_tokens:
                if any(q_term in kw.lower() for kw in chunk.keywords):
                    dot += 0.15
            scores.append((chunk, dot))

        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]

    def format_retrieval_context(self, retrieved: List[Tuple[RAGChunk, float]]) -> str:
        if not retrieved:
            return "No specific literature retrieved."
        lines = []
        for i, (chunk, score) in enumerate(retrieved, start=1):
            lines.append(
                f"[{i}] {chunk.source_title} ({chunk.authors}, {chunk.publication})\n"
                f"    Topic: {chunk.topic}\n"
                f"    Guidance: {chunk.text}\n"
            )
        return "\n".join(lines)


# Singleton instance
from services.api.config import settings
rag_engine = RAGEngine(settings.rag_knowledge_path)

