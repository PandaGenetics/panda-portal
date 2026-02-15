"""
Datasets API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from db import get_db, Dataset
from api.auth import auth_dependency

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


@router.get("/export/csv")
async def export_datasets_csv(
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Export all accessible datasets as CSV"""
    import csv
    from io import StringIO
    from fastapi.responses import Response
    
    user_role = token.get("role", "public")
    
    access_levels = {
        "public": ["public"],
        "registered": ["public", "registered"],
        "researcher": ["public", "registered", "researcher"],
        "collaborator": ["public", "registered", "researcher", "collaborator"],
        "admin": ["public", "registered", "researcher", "collaborator"],
    }
    allowed = access_levels.get(user_role, ["public"])
    datasets = db.query(Dataset).filter(Dataset.access_level.in_(allowed)).all()
    
    # Create CSV
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['id', 'name', 'description', 'species', 'data_type', 'access_level', 'file_size', 'created_at'])
    
    for ds in datasets:
        writer.writerow([
            ds.id,
            ds.name,
            ds.description or '',
            ds.species or '',
            ds.data_type,
            ds.access_level,
            ds.file_size or 0,
            ds.created_at.isoformat() if ds.created_at else '',
        ])
    
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=datasets.csv"}
    )


@router.get("/export/json")
async def export_datasets_json(
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Export all accessible datasets as JSON"""
    from fastapi.responses import JSONResponse
    
    user_role = token.get("role", "public")
    
    access_levels = {
        "public": ["public"],
        "registered": ["public", "registered"],
        "researcher": ["public", "registered", "researcher"],
        "collaborator": ["public", "registered", "researcher", "collaborator"],
        "admin": ["public", "registered", "researcher", "collaborator"],
    }
    allowed = access_levels.get(user_role, ["public"])
    datasets = db.query(Dataset).filter(Dataset.access_level.in_(allowed)).all()
    
    data = {
        "exported_at": datetime.utcnow().isoformat(),
        "total_count": len(datasets),
        "datasets": [
            {
                "id": ds.id,
                "name": ds.name,
                "description": ds.description,
                "species": ds.species,
                "data_type": ds.data_type,
                "access_level": ds.access_level,
                "file_size": ds.file_size,
                "created_at": ds.created_at.isoformat() if ds.created_at else None,
            }
            for ds in datasets
        ]
    }
    
    return JSONResponse(content=data)
