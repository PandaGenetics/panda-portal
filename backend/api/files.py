"""
Files API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import shutil
from datetime import datetime
from config import settings
from api.auth import auth_dependency
from db import get_db, Dataset

router = APIRouter()


@router.get("/genome/{species}/{file_type}/{filename}")
async def get_genome_file(
    species: str,
    file_type: str,
    filename: str,
):
    """Serve genome data files (public access)"""
    base_path = os.path.join(settings.GENOME_DATA_DIR, species, file_type)
    file_path = os.path.join(base_path, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    token: dict = Depends(auth_dependency)
):
    """Upload a file"""
    upload_path = settings.UPLOAD_DIR
    os.makedirs(upload_path, exist_ok=True)
    
    file_location = os.path.join(upload_path, file.filename)
    
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())
    
    return {"filename": file.filename, "path": file_location}


@router.post("/datasets")
async def upload_dataset(
    name: str,
    description: str = "",
    species: str = "",
    data_type: str = "other",
    access_level: str = "registered",
    file: UploadFile = File(...),
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Upload and register a dataset"""
    # Check if user has permission
    if token.get("role") not in ["admin", "researcher", "collaborator"]:
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # Create upload directory
    date_str = datetime.now().strftime("%Y%m%d")
    upload_dir = os.path.join(settings.UPLOAD_DIR, "datasets", date_str)
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save file
    file_path = os.path.join(upload_dir, file.filename)
    file_size = 0
    with open(file_path, "wb+") as f:
        content = await file.read()
        f.write(content)
        file_size = len(content)
    
    # Create dataset record
    dataset = Dataset(
        name=name,
        description=description,
        species=species,
        data_type=data_type,
        file_path=file_path,
        file_size=file_size,
        access_level=access_level,
        uploaded_by=token.get("sub"),
    )
    
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    
    return {
        "id": dataset.id,
        "name": dataset.name,
        "description": dataset.description,
        "species": dataset.species,
        "data_type": dataset.data_type,
        "access_level": dataset.access_level,
        "file_size": dataset.file_size,
        "created_at": dataset.created_at,
    }
