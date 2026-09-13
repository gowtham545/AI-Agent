from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    role = Column(String(50), nullable=False)  # Registrar, Faculty, Student
    department_id = Column(String(50), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    department_name = Column(String(150), nullable=True)
    designation = Column(String(150), nullable=True)
    can_upload_documents = Column(Boolean, default=True)
    can_edit_documents = Column(Boolean, default=True)
    can_approve_directives = Column(Boolean, default=True)
    can_broadcast_nudge = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    department_rel = relationship("Department", back_populates="users")

    def __repr__(self):
        return f"<User {self.role}: {self.name} ({self.email})>"
