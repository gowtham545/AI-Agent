from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..db.base import Base

class Acknowledgement(Base):
    __tablename__ = "acknowledgements"

    id = Column(String(50), primary_key=True, index=True)
    circular_id = Column(String(50), ForeignKey("circulars.id", ondelete="CASCADE"), nullable=False, index=True)
    recipient_id = Column(String(50), ForeignKey("recipients.id", ondelete="CASCADE"), nullable=False, index=True)
    delivery_status = Column(String(50), default="Delivered")  # Delivered, Failed, Bounced
    read_status = Column(String(50), default="Unread")  # Read, Unread
    acknowledgement_status = Column(String(50), default="Pending", index=True)  # Acknowledged, Pending, Overdue
    acknowledged_at = Column(String(50), nullable=True)
    last_activity = Column(String(50), nullable=True)
    digital_signature_hash = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    circular_rel = relationship("Circular", back_populates="acknowledgements")
    recipient_rel = relationship("Recipient", back_populates="acknowledgements")

    def __repr__(self):
        return f"<Acknowledgement {self.circular_id} - {self.recipient_id}: {self.acknowledgement_status}>"
