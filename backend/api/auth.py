"""
Authentication API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import EmailStr

from config import settings
from db import get_db, User, Role, UserSession
from schemas.auth import Token, LoginRequest, RegisterRequest, UserResponse

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


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
    
    return user


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
            "sub": user.id,
            "email": user.email,
            "role": user.role.name,
            "permissions": user.role.permissions
        },
        expires_delta=access_token_expires
    )
    
    # Store session (for logout/revocation)
    token_hash = get_password_hash(access_token)
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
        UserSession.token_hash == get_password_hash(token),
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


# Auth dependency helper
async def auth_dependency(token: str = Depends(get_token_from_header)):
    """Validate token and return payload"""
    payload = decode_token(token)
    
    # Check if token is revoked
    token_hash = get_password_hash(token)
    session = db.query(UserSession).filter(
        UserSession.token_hash == token_hash,
        UserSession.revoked == False,
        UserSession.expires_at > datetime.utcnow()
    ).first()
    
    if not session:
        raise HTTPException(status_code=401, detail="Token revoked or expired")
    
    return payload


def get_token_from_header(authorization: str = None):
    """Extract token from Authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    return parts[1]
