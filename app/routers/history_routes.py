from fastapi import APIRouter, Depends, Request
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import ConversionHistory
from ..auth_middleware import get_current_user

router = APIRouter()

templates = Jinja2Templates(directory="app/templates")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/history")

def history_page(
    request: Request,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    records = db.query(ConversionHistory)\
                .filter(ConversionHistory.user_id == user.id)\
                .order_by(ConversionHistory.id.desc())\
                .all()

    return templates.TemplateResponse(
        "history.html",
        {
            "request": request,
            "records": records
        }
    )
