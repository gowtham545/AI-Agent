from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import get_settings
from .api.routes.health import router as health_router
from .api.routes.circulars import router as circulars_router
import app.models  # noqa: F401 – ensures all ORM models are registered with Base.metadata

settings = get_settings()

# ── NOTE: Table creation is handled exclusively by Alembic (alembic upgrade head)
# ──       We do NOT call Base.metadata.create_all() here — use Alembic migrations.

app = FastAPI(
    title="CircularFlow AI Backend",
    description=(
        "Institutional Governance OS API — centralized circular registry, lineage tracking, "
        "role-based workflows, and telemetry services backed by PostgreSQL.\n\n"
        "**Database**: PostgreSQL (hosted — psycopg2)\n"
        "**ORM**: SQLAlchemy 2.x\n"
        "**Migrations**: Alembic\n"
        "**Institution**: Vignan's Foundation for Science, Technology & Research\n\n"
        "**Architecture**: React → FastAPI → SQLAlchemy → Hosted PostgreSQL"
    ),
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={"name": "Vignan IT & Admin", "email": "admin@vignan.ac.in"},
)

# ── CORS Middleware — React frontend only ────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=settings.ALLOW_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────────────────────
# Health at /api/health (backward-compatible)
app.include_router(health_router, prefix="/api")
# Versioned API at /api/v1
app.include_router(health_router, prefix=settings.API_V1_PREFIX)
app.include_router(circulars_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "CircularFlow AI Backend",
        "version": settings.VERSION,
        "status": "online",
        "architecture": "React -> FastAPI -> SQLAlchemy -> Hosted PostgreSQL",
        "database_engine": "PostgreSQL (psycopg2-binary)",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/api/health",
        "api_v1": {
            "health": f"{settings.API_V1_PREFIX}/health",
            "circulars": f"{settings.API_V1_PREFIX}/circulars",
        },
        "important": "DATABASE_URL is stored only in backend .env — never exposed to React frontend.",
    }


# ── Global exception handler — clean JSON errors, no stack traces to client ──
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Check server logs for details.",
            "service": "CircularFlow AI Backend",
            "path": str(request.url.path),
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=(settings.ENVIRONMENT == "development"),
    )
