from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from ..models.circulars import Circular
from ..schemas.circular import CircularListResponse, Circular as CircularSchema


class CircularService:

    @staticmethod
    def list_circulars(
        db: Session,
        department: Optional[str] = None,
        status: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 50,
    ) -> CircularListResponse:
        query = db.query(Circular)

        if department and department.lower() != "all departments":
            query = query.filter(
                func.lower(Circular.department) == department.lower()
            )

        if status and status.lower() != "all":
            query = query.filter(
                func.lower(Circular.status) == status.lower()
            )

        if category and category.lower() != "all":
            query = query.filter(
                func.lower(Circular.category) == category.lower()
            )

        if search:
            q = f"%{search.lower()}%"
            query = query.filter(
                or_(
                    func.lower(Circular.title).like(q),
                    func.lower(Circular.ref_no).like(q),
                    func.lower(Circular.summary).like(q),
                )
            )

        total = query.count()
        active_count = db.query(Circular).filter(
            func.lower(Circular.status) == "active"
        ).count()

        # Distinct department list from full table (not filtered subset)
        departments_rows = db.query(Circular.department).distinct().order_by(Circular.department).all()
        departments: List[str] = [row[0] for row in departments_rows if row[0]]

        start_idx = (page - 1) * page_size
        orm_items = query.order_by(Circular.published_date.desc()).offset(start_idx).limit(page_size).all()

        items = [CircularSchema.model_validate(c.__dict__) for c in orm_items]

        return CircularListResponse(
            items=items,
            total=total,
            active_count=active_count,
            departments=departments,
            page=page,
            page_size=page_size,
        )

    @staticmethod
    def get_circular_by_id(db: Session, circular_id: str) -> Optional[CircularSchema]:
        clean_id = circular_id.strip()
        circular = db.query(Circular).filter(
            or_(
                func.lower(Circular.id) == clean_id.lower(),
                func.lower(Circular.ref_no) == clean_id.lower(),
            )
        ).first()

        if circular is None:
            return None

        return CircularSchema.model_validate(circular.__dict__)
