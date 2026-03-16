
from fastapi import APIRouter
router = APIRouter(prefix="/auth")

@router.get("/login")
def login():
    return {"message":"login endpoint"}

@router.get("/register")
def register():
    return {"message":"register endpoint"}
