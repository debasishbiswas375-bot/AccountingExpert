import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError

from app.models import Base, User
from app.auth import get_password_hash

# ==============================
# FASTAPI APP
# ==============================

app = FastAPI()

# ==============================
# DATABASE CONFIG
# ==============================

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# ==============================
# STATIC & TEMPLATES
# ==============================

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# ==============================
# SAFE STARTUP
# ==============================

@app.on_event("startup")
def startup_event():
    try:
        print("Starting application...")

        # Create tables
        Base.metadata.create_all(bind=engine)
        print("Tables checked/created.")

        db = SessionLocal()

        # Admin credentials
        admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")
        admin_password = os.getenv("ADMIN_PASSWORD", "admin123")

        # Truncate to 72 bytes (bcrypt limit)
        admin_password = admin_password[:72]

        existing_admin = db.query(User).filter(User.email == admin_email).first()

        if not existing_admin:
            admin_user = User(
                email=admin_email,
                password=get_password_hash(admin_password),
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
            print("Admin user created.")

        db.close()
        print("Startup completed successfully.")

    except SQLAlchemyError as e:
        print("Database error during startup:", e)

    except Exception as e:
        print("General startup error:", e)

    finally:
        print("Application ready.")

# ==============================
# BASIC ROUTE (Landing)
# ==============================

from fastapi import Request

@app.get("/")
def landing(request: Request):
    return templates.TemplateResponse(
        "landing.html",
        {"request": request}
    )
