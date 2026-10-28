"""
Application Configuration for SparkStart Backend.
Loads environment variables safely with strict privacy defaults.
"""

import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseModel):
    # Server
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))
    debug: bool = os.getenv("DEBUG", "false").lower() in ("true", "1")
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174,http://localhost:8000",
        ).split(",")
    ]

    # AI Configuration
    ai_provider: str = os.getenv("AI_PROVIDER", "mock").lower()
    enable_remote_ai: bool = os.getenv("ENABLE_REMOTE_AI", "false").lower() in ("true", "1")
    gemini_api_key: str | None = os.getenv("GEMINI_API_KEY", None)
    openai_api_key: str | None = os.getenv("OPENAI_API_KEY", None)
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

    # RAG Settings
    rag_knowledge_path: Path = BASE_DIR / "knowledge" / "sources" / "knowledge_base.json"
    rag_top_k: int = int(os.getenv("RAG_TOP_K", "3"))

    # SQLite Local Database
    db_path: Path = BASE_DIR / "sparkstart_local.db"


settings = Settings()

