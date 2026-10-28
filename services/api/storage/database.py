"""
SQLite Local-First Database Layer for SparkStart
No cloud dependency. Everything stays on the user's local machine.
"""

import sqlite3
from pathlib import Path
from services.api.config import settings


def get_db_connection(db_path: Path | None = None) -> sqlite3.Connection:
    target_path = db_path or settings.db_path
    conn = sqlite3.connect(str(target_path))
    conn.row_factory = sqlite3.Row
    return conn


def init_db(db_path: Path | None = None):
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    # Tasks Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        energy TEXT DEFAULT 'unsure',
        status TEXT DEFAULT 'todo',
        deadline TEXT,
        completed_steps_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    # Micro-tasks Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS micro_tasks (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL,
        action_text TEXT NOT NULL,
        suggested_duration_minutes INTEGER NOT NULL,
        status TEXT DEFAULT 'suggested',
        step_order INTEGER DEFAULT 1,
        encouragement TEXT NOT NULL,
        why_manageable TEXT NOT NULL,
        alternative_step TEXT,
        source_refs_json TEXT,
        is_fallback INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
    );
    """)

    # Safe column migrations for existing databases
    try:
        cursor.execute("ALTER TABLE micro_tasks ADD COLUMN step_order INTEGER DEFAULT 1;")
    except Exception:
        pass
    try:
        cursor.execute("ALTER TABLE tasks ADD COLUMN total_steps_count INTEGER DEFAULT 0;")
    except Exception:
        pass

    # Preferences Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS preferences (
        id TEXT PRIMARY KEY,
        preferences_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()

