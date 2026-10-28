"""
SparkStart FastAPI Application Entrypoint
Empathetic, Low-Pressure Task Sequencer API.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.api.config import settings
from services.api.storage.database import init_db
from services.api.rag.engine import rag_engine

# Import Routers
from services.api.api.routes_health import router as health_router
from services.api.api.routes_sequence import router as sequence_router
from services.api.api.routes_tasks import router as tasks_router
from services.api.api.routes_knowledge import router as knowledge_router
from services.api.api.routes_preferences import router as preferences_router
from services.api.api.routes_privacy import router as privacy_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database and load knowledge
    init_db()
    rag_engine.load_and_index()
    yield
    # Shutdown logic if needed


app = FastAPI(
    title="SparkStart AI Task Sequencer",
    description="Adaptive, low-pressure task sequencing engine with RAG literature grounding and local-first privacy.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration for local Web Dashboard and Electron Desktop Companion
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local desktop and browser access safely
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes with /api prefix
app.include_router(health_router, prefix="/api")
app.include_router(sequence_router, prefix="/api")
app.include_router(tasks_router, prefix="/api")
app.include_router(knowledge_router, prefix="/api")
app.include_router(preferences_router, prefix="/api")
app.include_router(privacy_router, prefix="/api")


@app.get("/")
def root():
    return {
        "name": "SparkStart Task Sequencer API",
        "tagline": "Small steps. Real progress.",
        "docsUrl": "/docs",
        "healthUrl": "/api/health",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.api.main:app", host=settings.host, port=settings.port, reload=settings.debug)

