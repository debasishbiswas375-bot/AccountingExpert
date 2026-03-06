from jose import jwt, JWTError
from fastapi import Request, HTTPException, Depends
from sqlalchemy.orm import Session
import os

from .database import SessionLocal
from .models import User


SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
ALGORITHM = "HS256"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return None

    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=[ALGORITHM])
        email = payload.get("email")

        if not email:
            return None

        user = db.query(User).filter(
            User.email == email,
            User.is_deleted == False
        ).first()

        return user

    except JWTError:
        return None


def require_admin(user: User = Depends(get_current_user)):
    if not user or user.role not in ["admin", "co_admin"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
