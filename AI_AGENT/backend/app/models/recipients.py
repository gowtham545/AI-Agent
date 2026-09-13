from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from ..db.base import Base

class Recipient(Base):
    __tablename__ = "recipients"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    role = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False, index=True)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    acknowledgements = relationship("Acknowledgement", back_populates="recipient_rel", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Recipient {self.name} ({self.department})>"
