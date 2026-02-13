"""
Pedigree database model
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from db.connection import Base


class PedigreeRecord(Base):
    __tablename__ = "pedigree_records"
    
    id = Column(Integer, primary_key=True, index=True)
    species = Column(String(100))
    individual_id = Column(String(100), unique=True, nullable=False)
    sire_id = Column(String(100))  # Father's ID
    dam_id = Column(String(100))   # Mother's ID
    birth_date = Column(DateTime)
    sex = Column(String(20))
    location = Column(String(255))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
