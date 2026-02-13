"""
User Pydantic schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserInDB(BaseModel):
    id: int
    email: str
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    organization: Optional[str]
    role_id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    organization: Optional[str] = None


class RoleUpdate(BaseModel):
    role_name: str
