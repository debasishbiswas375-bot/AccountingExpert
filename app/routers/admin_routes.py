from fastapi import APIRouter, Depends, Request, Form
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import SessionLocal
from ..models import User, Plan, ConversionHistory
from ..auth_middleware import require_admin

router = APIRouter(prefix="/admin")

templates = Jinja2Templates(directory="app/templates")


# -----------------------------
# Database dependency
# -----------------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------------
# Admin Dashboard
# -----------------------------

@router.get("")
def admin_dashboard(
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    total_users = db.query(User).count()

    total_conversions = db.query(ConversionHistory).count()

    total_plans = db.query(Plan).count()

    total_credits_used = db.query(ConversionHistory).with_entities(
        ConversionHistory.credits_used
    ).all()

    credits_sum = sum([c[0] for c in total_credits_used]) if total_credits_used else 0

    return templates.TemplateResponse(
        "admin_dashboard.html",
        {
            "request": request,
            "total_users": total_users,
            "total_conversions": total_conversions,
            "total_plans": total_plans,
            "credits_used": credits_sum
        }
    )


# -----------------------------
# View Users
# -----------------------------

@router.get("/users")
def admin_users(
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    users = db.query(User).all()

    return templates.TemplateResponse(
        "admin_users.html",
        {
            "request": request,
            "users": users
        }
    )


# -----------------------------
# Update User Credits
# -----------------------------

@router.post("/user/update-credits")
def update_user_credits(
    user_id: int = Form(...),
    credits: float = Form(...),
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    user = db.query(User).filter(User.id == user_id).first()

    if user:
        user.credits = credits
        db.commit()

    return {"status": "updated"}


# -----------------------------
# View Plans
# -----------------------------

@router.get("/plans")
def admin_plans(
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    plans = db.query(Plan).all()

    return templates.TemplateResponse(
        "admin_plans.html",
        {
            "request": request,
            "plans": plans
        }
    )


# -----------------------------
# Create Plan
# -----------------------------

@router.post("/plans/create")
def create_plan(
    name: str = Form(...),
    credits: float = Form(...),
    price: float = Form(...),
    duration_days: int = Form(...),
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    new_plan = Plan(
        name=name,
        credits=credits,
        price=price,
        duration_days=duration_days
    )

    db.add(new_plan)
    db.commit()

    return {"status": "plan_created"}


# -----------------------------
# Delete Plan
# -----------------------------

@router.post("/plans/delete")
def delete_plan(
    plan_id: int = Form(...),
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    plan = db.query(Plan).filter(Plan.id == plan_id).first()

    if plan:
        db.delete(plan)
        db.commit()

    return {"status": "plan_deleted"}
