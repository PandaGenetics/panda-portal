"""
Role database model
"""
from sqlalchemy import Column, Integer, String, Text, JSON
from sqlalchemy.orm import relationship
from db.connection import Base


class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)  # public, registered, researcher, collaborator, admin
    description = Column(Text)
    permissions = Column(JSON, default=list)  # Array of permission strings
    
    # Relationships
    users = relationship("User", back_populates="role")
