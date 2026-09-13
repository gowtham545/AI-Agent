from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.orm import relationship
from ..db.base import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(150), unique=True, nullable=False, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="department_rel", cascade="all, delete-orphan")
    circulars = relationship("Circular", back_populates="department_rel")

    def __repr__(self):
        return f"<Department {self.code}: {self.name}>"
