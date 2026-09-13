from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..db.base import Base

class CircularVersion(Base):
    __tablename__ = "circular_versions"

    id = Column(String(50), primary_key=True, index=True)
    circular_id = Column(String(50), ForeignKey("circulars.id", ondelete="CASCADE"), nullable=False, index=True)
    version_number = Column(String(20), nullable=False)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    body = Column(Text, nullable=True)
    change_summary = Column(Text, nullable=True)
    published_date = Column(String(50), nullable=True)
    created_by = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    circular_rel = relationship("Circular", back_populates="versions")

    def __repr__(self):
        return f"<CircularVersion {self.circular_id} {self.version_number}>"
