from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Plan

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.get("/pricing", response_class=HTMLResponse)
def pricing(request: Request, db: Session = Depends(get_db)):
    plans = db.query(Plan).all()
    return templates.TemplateResponse("pricing.html", {"request": request, "plans": plans})
