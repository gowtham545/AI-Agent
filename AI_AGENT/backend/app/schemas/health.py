from pydantic import BaseModel, Field
from typing import Optional

class HealthResponse(BaseModel):
    status: str = Field(..., description="Service status: 'ok' | 'degraded' | 'error'", example="ok")
    service: str = Field(..., description="Service name", example="CircularFlow AI Backend")
    version: str = Field(default="1.0.0", description="API Version", example="1.0.0")
    environment: str = Field(default="development", description="Operating environment", example="development")
    database: str = Field(default="unknown", description="Database connectivity status: 'connected' | 'unavailable'", example="connected")
    db_dialect: Optional[str] = Field(None, description="Database engine dialect (e.g. 'postgresql')", example="postgresql")
    db_driver: Optional[str] = Field(None, description="Low-level driver name (e.g. 'psycopg2')", example="psycopg2")
