from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..db.base import Base

class ActionItem(Base):
    __tablename__ = "actions"

    id = Column(String(50), primary_key=True, index=True)
    action_id = Column(String(50), unique=True, nullable=False, index=True)  # e.g., ACT-2026-001
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    source_circular_id = Column(String(50), ForeignKey("circulars.id", ondelete="SET NULL"), nullable=True)
    source_circular_ref = Column(String(50), nullable=True)
    responsible_role = Column(String(100), nullable=False)
    responsible_department = Column(String(100), nullable=False, index=True)
    deadline = Column(String(50), nullable=False)
    priority = Column(String(50), nullable=False)  # Critical, High, Medium, Low
    status = Column(String(50), nullable=False, default="NOT_STARTED", index=True)  # NOT_STARTED, IN_PROGRESS, COMPLETED, OVERDUE
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    circular_rel = relationship("Circular", back_populates="actions")

    def __repr__(self):
        return f"<ActionItem {self.action_id}: {self.title[:30]} ({self.status})>"
