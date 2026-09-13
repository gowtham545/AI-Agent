from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON
from ..db.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True, index=True)
    event_type = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    user_role = Column(String(100), nullable=True)
    user_name = Column(String(150), nullable=True)
    related_circular_id = Column(String(50), nullable=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    event_metadata = Column(JSON, nullable=True)

    def __repr__(self):
        return f"<AuditLog {self.event_type} at {self.timestamp}: {self.description[:40]}>"
