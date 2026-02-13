"""
Files API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
from config import settings

router = APIRouter()


@router.get("/genome/{species}/{file_type}/{filename}")
async def get_genome_file(
    species: str,
    file_type: str,
    filename: str,
    token: dict = Depends(auth_dependency)
):
    """Serve genome data files"""
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
