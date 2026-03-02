from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import os

from .database import engine, SessionLocal, Base
from .models import User, Plan
from .auth import get_password_hash

app = FastAPI()   # 👈 THIS MUST EXIST

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

Base.metadata.create_all(bind=engine)


def init_data():
    db = SessionLocal()

    free_plan = db.query(Plan).filter(Plan.name == "Free").first()
    if not free_plan:
        free_plan = Plan(name="Free", credits=10)
        db.add(free_plan)
        db.commit()

    admin = db.query(User).filter(User.role == "admin").first()
    if not admin:
        admin_email = os.getenv("ADMIN_EMAIL")
        admin_password = os.getenv("ADMIN_PASSWORD")

        if not admin_email or not admin_password:
            raise Exception("Admin credentials missing")

        hashed_password = get_password_hash(admin_password)

        new_admin = User(
            email=admin_email,
            hashed_password=hashed_password,
            role="admin",
            credits=9999,
            plan_id=free_plan.id
        )

        db.add(new_admin)
        db.commit()

    db.close()


@app.on_event("startup")
def startup_event():
    init_data()


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
