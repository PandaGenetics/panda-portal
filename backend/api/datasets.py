"""
Datasets API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from db import get_db, Dataset

router = APIRouter()


@router.get("")
async def list_datasets(
    skip: int = 0,
    limit: int = 20,
    species: str = None,
    data_type: str = None,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """List datasets based on user permissions"""
    user_role = token.get("role", "public")
    
    query = db.query(Dataset)
    
    # Filter by species
    if species:
        query = query.filter(Dataset.species == species)
    
    # Filter by data type
    if data_type:
        query = query.filter(Dataset.data_type == data_type)
    
    # Filter by access level
    access_levels = {
        "public": ["public"],
        "registered": ["public", "registered"],
        "researcher": ["public", "registered", "researcher"],
        "collaborator": ["public", "registered", "researcher", "collaborator"],
        "admin": ["public", "registered", "researcher", "collaborator"],
    }
    allowed = access_levels.get(user_role, ["public"])
    query = query.filter(Dataset.access_level.in_(allowed))
    
    total = query.count()
    datasets = query.offset(skip).limit(limit).all()
    
    return {
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit,
        "datasets": datasets,
    }


@router.get("/{dataset_id}")
async def get_dataset(
    dataset_id: int,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Get dataset details"""
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset
