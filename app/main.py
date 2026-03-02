from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import os

from .database import engine, SessionLocal, Base
from .models import User, Plan
from .auth import get_password_hash

# --------------------------------------------------
# App Init
# --------------------------------------------------

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Static & Template directories (Render safe)
app.mount(
    "/static",
    StaticFiles(directory=os.path.join(BASE_DIR, "static")),
    name="static"
)

templates = Jinja2Templates(
    directory=os.path.join(BASE_DIR, "templates")
)

# --------------------------------------------------
# Create Tables
# --------------------------------------------------

Base.metadata.create_all(bind=engine)

# --------------------------------------------------
# Initial Data Setup
# --------------------------------------------------

def init_data():
    db = SessionLocal()

    try:
        # 1️⃣ Create Free Plan if not exists
        free_plan = db.query(Plan).filter(Plan.name == "Free").first()
        if not free_plan:
            free_plan = Plan(
                name="Free",
                credits=10
            )
            db.add(free_plan)
            db.commit()
            db.refresh(free_plan)

        # 2️⃣ Create Admin if not exists
        admin = db.query(User).filter(User.role == "admin").first()
        if not admin:
            admin_email = os.getenv("ADMIN_EMAIL")
            admin_password = os.getenv("ADMIN_PASSWORD")

            if not admin_email or not admin_password:
                raise Exception("ADMIN_EMAIL or ADMIN_PASSWORD missing")

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

    finally:
        db.close()

# Run on startup
@app.on_event("startup")
def startup_event():
    init_data()

# --------------------------------------------------
# Routes
# --------------------------------------------------

# Home Page
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )

# Admin Page (basic for now)
@app.get("/admin", response_class=HTMLResponse)
def admin_panel(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )
