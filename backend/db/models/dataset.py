"""
Dataset database model
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, BigInteger, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from db.connection import Base


class Dataset(Base):
    __tablename__ = "datasets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    species = Column(String(100))
    data_type = Column(String(50))  # genome, transcriptome, variant, alignment
    file_path = Column(Text, nullable=False)
    file_size = Column(BigInteger)
    access_level = Column(String(50), default="registered")  # public, registered, researcher, collaborator
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    metadata = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    uploader = relationship("User", back_populates="datasets")
