"""
Authentication API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
import hashlib
from pydantic import EmailStr

from config import settings
from db import get_db, User, Role, UserSession
from schemas.auth import Token, LoginRequest, RegisterRequest, UserResponse

router = APIRouter()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def hash_token(token: str) -> str:
    """Hash a token using SHA256 (for token storage)"""
    return hashlib.sha256(token.encode()).hexdigest()


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def get_token_from_header(request: Request):
    """Extract token from Authorization header"""
    authorization = request.headers.get("Authorization")
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    return parts[1]


async def auth_dependency(request: Request, db: Session = Depends(get_db)):
    """Validate token and return payload"""
    token = await get_token_from_header(request)
    payload = decode_token(token)
    
    # Convert sub to int for database queries
    if "sub" in payload:
        payload["sub"] = int(payload["sub"])
    
    # Check if token is revoked
    token_hash = hash_token(token)
    session = db.query(UserSession).filter(
        UserSession.token_hash == token_hash,
        UserSession.revoked == False,
        UserSession.expires_at > datetime.utcnow()
    ).first()
    
    if not session:
        raise HTTPException(status_code=401, detail="Token revoked or expired")
    
    return payload


@router.post("/register", response_model=UserResponse)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == request.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Get default role (public)
    role = db.query(Role).filter(Role.name == "public").first()
    if not role:
        role = Role(name="public", description="Public user", permissions=["view_public_datasets", "use_genome_browser"])
        db.add(role)
        db.commit()
        db.refresh(role)
    
    # Create user
    user = User(
        email=request.email,
        username=request.username,
        password_hash=get_password_hash(request.password),
        first_name=request.first_name,
        last_name=request.last_name,
        organization=request.organization,
        role_id=role.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Return user with role_name
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "organization": user.organization,
        "role_id": user.role_id,
        "role_name": role.name,
        "is_active": user.is_active,
        "created_at": user.created_at,
    }


@router.post("/login", response_model=Token)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=401, detail="Account is disabled")
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": user.role.name,
            "permissions": user.role.permissions
        },
        expires_delta=access_token_expires
    )
    
    # Store session (for logout/revocation)
    token_hash = hash_token(access_token)
    session = UserSession(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.utcnow() + access_token_expires
    )
    db.add(session)
    db.commit()
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout(token: str = Depends(auth_dependency), db: Session = Depends(get_db)):
    """Logout and revoke token"""
    # Mark session as revoked
    session = db.query(UserSession).filter(
        UserSession.token_hash == hash_token(token),
        UserSession.revoked == False
    ).first()
    
    if session:
        session.revoked = True
        db.commit()
    
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(token: str = Depends(auth_dependency), db: Session = Depends(get_db)):
    """Get current user info"""
    user_id = token.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


# ==================== Password Reset ====================

@router.post("/password-reset-request")
async def request_password_reset(
    email: str,
    db: Session = Depends(get_db)
):
    """Request a password reset email"""
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Don't reveal if user exists
        return {"message": "If an account exists, a reset link will be sent"}
    
    # Create reset token (valid for 1 hour)
    reset_token = create_access_token(
        data={"sub": str(user.id), "type": "password_reset"},
        expires_delta=timedelta(hours=1)
    )
    
    # In production, send email here
    # For demo, return the reset link
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
    
    return {
        "message": "If an account exists, a reset link will be sent",
        "demo_reset_link": reset_link  # Only for demo
    }


@router.post("/password-reset/confirm")
async def confirm_password_reset(
    token: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    """Reset password with valid token"""
    try:
        payload = decode_token(token)
        if payload.get("type") != "password_reset":
            raise HTTPException(status_code=400, detail="Invalid token type")
        
        user_id = int(payload.get("sub"))
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update password
        user.password_hash = get_password_hash(new_password)
        db.commit()
        
        return {"message": "Password reset successfully"}
        
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
