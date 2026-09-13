from fastapi import APIRouter
from ...config import get_settings
from ...schemas.health import HealthResponse
from ...db.database import get_db_info

router = APIRouter(tags=["Health & Status"])

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service Health Check",
    description=(
        "Returns operational status, service version, environment, and PostgreSQL "
        "database connectivity. Never exposes credentials or internal connection strings."
    )
)
async def get_health() -> HealthResponse:
    settings = get_settings()
    db_info = get_db_info()

    return HealthResponse(
        status="ok" if db_info["connected"] else "degraded",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        database="connected" if db_info["connected"] else "unavailable",
        db_dialect=db_info.get("dialect"),
        db_driver=db_info.get("driver"),
    )
