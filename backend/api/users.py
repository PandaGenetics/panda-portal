"""
User API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from db import get_db, User
from api.auth import auth_dependency

router = APIRouter()


@router.get("/me")
async def get_current_user(token: dict = Depends(auth_dependency)):
    """Get current user info"""
    db = next(get_db())
    try:
        user = db.query(User).filter(User.id == token.get("sub")).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "organization": user.organization,
            "role_id": user.role_id,
            "is_active": user.is_active,
            "created_at": user.created_at,
        }
    finally:
        db.close()


@router.put("/me")
async def update_current_user(
    data: dict,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Update current user info"""
    user = db.query(User).filter(User.id == token.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update allowed fields
    if "first_name" in data:
        user.first_name = data["first_name"]
    if "last_name" in data:
        user.last_name = data["last_name"]
    if "organization" in data:
        user.organization = data["organization"]
    
    db.commit()
    db.refresh(user)
    
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "organization": user.organization,
        "role_id": user.role_id,
        "is_active": user.is_active,
        "created_at": user.created_at,
    }
