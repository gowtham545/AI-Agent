from datetime import datetime
from sqlalchemy import Column, String, Text, Float, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..db.base import Base

class Circular(Base):
    __tablename__ = "circulars"

    id = Column(String(50), primary_key=True, index=True)
    ref_no = Column(String(50), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False, index=True)
    department = Column(String(100), nullable=False, index=True)
    department_id = Column(String(50), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    category = Column(String(100), nullable=False, index=True)
    status = Column(String(50), nullable=False, index=True)  # Active, Superseded, Under Review, Draft
    priority = Column(String(50), nullable=False)  # Critical, High, Medium, Low
    published_date = Column(String(50), nullable=False)
    effective_date = Column(String(50), nullable=False)
    expiry_date = Column(String(50), nullable=True)
    version = Column(String(20), default="v1.0")
    author = Column(String(150), nullable=True)
    signatory = Column(String(150), nullable=True)
    summary = Column(Text, nullable=False)
    body = Column(Text, nullable=False)
    
    # Lineage tracking
    supersedes_id = Column(String(50), ForeignKey("circulars.id", ondelete="SET NULL"), nullable=True)
    supersedes_ref = Column(String(50), nullable=True)
    superseded_by_id = Column(String(50), ForeignKey("circulars.id", ondelete="SET NULL"), nullable=True)
    superseded_by_ref = Column(String(50), nullable=True)
    
    # Metadata & Metrics
    target_audience = Column(JSON, default=list)
    tags = Column(JSON, default=list)
    required_actions = Column(JSON, default=list)
    acknowledgement_rate = Column(Float, default=0.0)
    total_recipients = Column(Integer, default=0)
    acknowledged_recipients = Column(Integer, default=0)
    file_attachment = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    department_rel = relationship("Department", back_populates="circulars")
    versions = relationship("CircularVersion", back_populates="circular_rel", cascade="all, delete-orphan")
    actions = relationship("ActionItem", back_populates="circular_rel")
    acknowledgements = relationship("Acknowledgement", back_populates="circular_rel", cascade="all, delete-orphan")
    
    # Self-referential lineage relationships
    superseded_circular = relationship(
        "Circular",
        foreign_keys=[supersedes_id],
        remote_side=[id],
        backref="superseding_children"
    )
    superseding_circular = relationship(
        "Circular",
        foreign_keys=[superseded_by_id],
        remote_side=[id]
    )

    def __repr__(self):
        return f"<Circular {self.ref_no}: {self.title[:30]} ({self.status})>"
