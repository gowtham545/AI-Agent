import os
import sys
from functools import lru_cache
from typing import List

from dotenv import load_dotenv

# Load .env from the backend directory (or wherever the process runs from)
load_dotenv()


def _resolve_database_url(url: str | None) -> str:
    """
    Require a real PostgreSQL connection string for this phase.
    SQLite is explicitly rejected to ensure the app uses dynamic PostgreSQL data.
    """
    normalized = (url or "").strip()

    if not normalized:
        raise ValueError(
            "PostgreSQL DATABASE_URL is not configured. Set DATABASE_URL in backend/.env to a real postgresql:// connection string."
        )

    if normalized.startswith("sqlite"):
        raise ValueError(
            "SQLite DATABASE_URL is not allowed. Replace it with a PostgreSQL connection string like postgresql://user:pass@host:5432/dbname"
        )

    if normalized.startswith(("postgresql://", "postgres://")):
        from urllib.parse import urlparse
        try:
            parsed = urlparse(normalized)
            if not parsed.hostname or parsed.hostname.upper() in ("HOST", "YOUR_HOST", "HOSTNAME"):
                raise ValueError("placeholder hostname detected")
            if not parsed.username or parsed.username.upper() in ("USER", "YOUR_USERNAME", "USERNAME"):
                raise ValueError("placeholder username detected")
            if parsed.port is None:
                raise ValueError("port is required")
        except ValueError as exc:
            raise ValueError(f"Invalid PostgreSQL DATABASE_URL: {exc}") from exc
        return normalized

    raise ValueError(
        "Unsupported database scheme. DATABASE_URL must begin with postgresql:// or postgres://"
    )



class Settings:
    PROJECT_NAME: str = "CircularFlow AI Backend"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"

    BACKEND_HOST: str = os.getenv("BACKEND_HOST", "0.0.0.0")
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info")

    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    ALLOW_ORIGIN_REGEX: str = os.getenv("ALLOW_ORIGIN_REGEX", r"https?://(localhost|127\.0\.0\.1):\d+")

    # Prefer PostgreSQL when configured; otherwise fall back to the local SQLite DB
    # so the project runs in a clean local development environment.
    DATABASE_URL: str = _resolve_database_url(os.getenv("DATABASE_URL"))

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        origins_str = os.getenv(
            "ALLOWED_ORIGINS",
            f"{self.FRONTEND_URL},http://localhost:5173,http://localhost:5174,http://localhost:5175,"
            f"http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175,"
            f"http://localhost:3000,http://localhost:4173"
        )
        return [origin.strip() for origin in origins_str.split(",") if origin.strip()]

    @property
    def is_postgresql(self) -> bool:
        return self.DATABASE_URL.startswith(("postgresql://", "postgres://"))


@lru_cache()
def get_settings() -> Settings:
    return Settings()
