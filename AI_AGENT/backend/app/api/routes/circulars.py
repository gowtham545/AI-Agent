from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status, Depends
from sqlalchemy.orm import Session
from ...schemas.circular import Circular, CircularListResponse
from ...services.circular_service import CircularService
from ...db.database import get_db

router = APIRouter(prefix="/circulars", tags=["Circulars & Governance Directives"])

@router.get(
    "",
    response_model=CircularListResponse,
    summary="List Institutional Circulars",
    description="Retrieve circulars from the PostgreSQL database with optional filtering by department, status, category, or search query."
)
async def get_circulars(
    department: Optional[str] = Query(None, description="Filter by issuing department"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (Active, Superseded, Under Review, Draft)"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search keyword in title, ref number, or summary"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
) -> CircularListResponse:
    try:
        return CircularService.list_circulars(
            db=db,
            department=department,
            status=status_filter,
            category=category,
            search=search,
            page=page,
            page_size=page_size,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database query failed: {str(exc)}"
        )

@router.get(
    "/{circular_id}",
    response_model=Circular,
    summary="Get Circular By ID or Reference",
    description="Fetch a specific circular from the database by internal ID (e.g., 'circ-001') or ref number (e.g., 'CIR-2026-052')."
)
async def get_circular_by_id(
    circular_id: str,
    db: Session = Depends(get_db),
) -> Circular:
    try:
        circular = CircularService.get_circular_by_id(db=db, circular_id=circular_id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database query failed: {str(exc)}"
        )
    if not circular:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Circular '{circular_id}' not found in the institutional repository."
        )
    return circular
