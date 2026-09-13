from typing import Generator
from sqlalchemy import create_engine, text, event
from sqlalchemy.orm import sessionmaker, Session
from ..config import get_settings

settings = get_settings()

# ── PostgreSQL engine — optimised for hosted connection pools (e.g. Neon, Supabase, Railway) ──
engine = create_engine(
    settings.DATABASE_URL,
    # No connect_args needed for PostgreSQL (unlike SQLite's check_same_thread)
    pool_pre_ping=True,       # Validate connections before use (essential for hosted DBs)
    pool_size=5,              # Keep 5 persistent connections in the pool
    max_overflow=10,          # Allow up to 10 overflow connections under load
    pool_timeout=30,          # Wait up to 30s for a connection from the pool
    pool_recycle=1800,        # Recycle connections every 30 minutes (prevents stale conn errors)
    echo=(settings.ENVIRONMENT == "development"),
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency injector — yields a PostgreSQL session per request.
    Always closes the session after the request completes, even on error.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> bool:
    """
    Verify PostgreSQL is reachable.
    Returns True on a live SELECT 1, False on any connection or query error.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


def get_db_info() -> dict:
    """
    Returns database connectivity details for health checks.
    Never exposes credentials — only dialect name and connectivity status.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {
            "connected": True,
            "dialect": engine.dialect.name,     # e.g. "postgresql"
            "driver": engine.dialect.driver,    # e.g. "psycopg2"
        }
    except Exception as exc:
        return {
            "connected": False,
            "dialect": engine.dialect.name,
            "driver": engine.dialect.driver,
            "error": str(exc)[:200],            # Truncated — never expose full stack in API
        }
