from fastapi import FastAPI, Request, Form, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from app.database import engine, SessionLocal, Base
from app.models import User, Plan
from app.auth import get_password_hash, verify_password, create_access_token
from app.dependencies import get_current_user

load_dotenv()

app = FastAPI()
Base.metadata.create_all(bind=engine)

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")


def init_data():
    db = SessionLocal()

    free_plan = db.query(Plan).filter(Plan.name == "Free").first()
    if not free_plan:
        free_plan = Plan(name="Free", price=0, credits=10, description="Free Plan")
        db.add(free_plan)
        db.commit()

    admin = db.query(User).filter(User.role == "admin").first()
    if not admin:
        admin = User(
            email=os.getenv("ADMIN_EMAIL"),
            hashed_password=get_password_hash(os.getenv("ADMIN_PASSWORD")),
            role="admin",
            credits=9999,
            plan_id=free_plan.id
        )
        db.add(admin)
        db.commit()

    db.close()

init_data()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/", response_class=HTMLResponse)
def landing(request: Request):
    return templates.TemplateResponse("landing.html", {"request": request})


@app.get("/dashboard", response_class=HTMLResponse)
def dashboard(request: Request, user=Depends(get_current_user)):
    return templates.TemplateResponse("dashboard.html", {"request": request, "user": user})


@app.get("/plans", response_class=HTMLResponse)
def plans_page(request: Request, db: Session = Depends(get_db)):
    plans = db.query(Plan).all()
    return templates.TemplateResponse("plans.html", {"request": request, "plans": plans})


@app.post("/register")
def register(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    free_plan = db.query(Plan).filter(Plan.name == "Free").first()

    user = User(
        email=email,
        hashed_password=get_password_hash(password),
        role="user",
        credits=free_plan.credits,
        plan_id=free_plan.id
    )
    db.add(user)
    db.commit()

    return RedirectResponse("/", status_code=303)


@app.post("/login")
def login(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.hashed_password):
        return RedirectResponse("/", status_code=303)

    token = create_access_token({"user_id": user.id})
    response = RedirectResponse("/dashboard", status_code=303)
    response.set_cookie(key="access_token", value=token, httponly=True)
    return response


@app.get("/admin", response_class=HTMLResponse)
def admin_panel(request: Request, user=Depends(get_current_user)):
    if user.role != "admin":
        return RedirectResponse("/dashboard", status_code=303)
    return templates.TemplateResponse("admin.html", {"request": request, "user": user})
