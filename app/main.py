from fastapi import FastAPI, Request, Form, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from fastapi.templating import Jinja2Templates

from app.database import engine, SessionLocal, Base
from app.models import User
from app.auth import get_password_hash, verify_password

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.mount(""/static"", StaticFiles(directory=""app/static""), name=""static"")
templates = Jinja2Templates(directory=""app/templates"")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get(""/"", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(""index.html"", {""request"": request})

@app.post(""/register"")
def register(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = User(email=email, hashed_password=get_password_hash(password))
    db.add(user)
    db.commit()
    return RedirectResponse(""/"", status_code=303)

@app.post(""/login"")
def login(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user and verify_password(password, user.hashed_password):
        return RedirectResponse(""/"", status_code=303)
    return RedirectResponse(""/"", status_code=303)
