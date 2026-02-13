"""
Dataset Pydantic schemas
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DatasetBase(BaseModel):
    name: str
    description: Optional[str] = None
    species: Optional[str] = None
    data_type: Optional[str] = None
    access_level: str = "registered"


class DatasetCreate(DatasetBase):
    pass


class DatasetUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    access_level: Optional[str] = None
    metadata: Optional[dict] = None


class DatasetResponse(DatasetBase):
    id: int
    file_path: str
    file_size: Optional[int]
    uploader_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DatasetListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    datasets: List[DatasetResponse]
