from fastapi import APIRouter, Form, Depends, Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User
from app.auth import hash_password, verify_password, create_token

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.get("/login")
def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@router.post("/login")
def login(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return RedirectResponse("/login", status_code=302)
    token = create_token({"user_id": user.id, "is_admin": user.is_admin})
    response = RedirectResponse("/dashboard", status_code=302)
    response.set_cookie("access_token", token, httponly=True)
    return response

@router.get("/register")
def register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@router.post("/register")
def register(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    db.add(User(email=email, hashed_password=hash_password(password), credits=100))
    db.commit()
    return RedirectResponse("/login", status_code=302)
