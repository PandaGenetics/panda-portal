"""
Pedigree API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db import get_db, PedigreeRecord
from api.auth import auth_dependency

router = APIRouter()


@router.get("")
async def list_pedigree(
    species: str = None,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """List pedigree records"""
    query = db.query(PedigreeRecord)
    
    if species:
        query = query.filter(PedigreeRecord.species == species)
    
    records = query.all()
    return records


@router.get("/{individual_id}")
async def get_pedigree_record(
    individual_id: str,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Get single pedigree record"""
    record = db.query(PedigreeRecord).filter(
        PedigreeRecord.individual_id == individual_id
    ).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


@router.get("/species/{species}/tree")
async def get_pedigree_tree(
    species: str,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Get full pedigree tree for a species"""
    records = db.query(PedigreeRecord).filter(
        PedigreeRecord.species == species
    ).all()
    
    # Build tree structure
    tree = []
    # This is a simplified version - full implementation would be more complex
    return records
