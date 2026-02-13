"""
User management API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db import get_db, User, Role
from api.auth import auth_dependency, get_password_hash

router = APIRouter()


@router.get("")
async def list_users(
    skip: int = 0,
    limit: int = 100,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """List all users (admin only)"""
    # Check if admin
    if token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/{user_id}")
async def get_user(
    user_id: int,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Get user details"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}")
async def update_user(
    user_id: int,
    data: dict,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Update user"""
    if token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update fields
    for key, value in data.items():
        if key not in ["id", "password_hash", "email", "created_at"]:
            setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Delete user (admin only)"""
    if token.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}
