from fastapi import FastAPI, Request, Form, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session
from jinja2 import Environment, FileSystemLoader

from app.dependencies import get_db
from app.models import User
from app.auth import hash_password, verify_password

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="supersecretkey")

app.mount("/static", StaticFiles(directory="app/static"), name="static")

templates = Environment(loader=FileSystemLoader("app/templates"))

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    template = templates.get_template("index.html")
    return HTMLResponse(template.render(request=request))

@app.get("/auth", response_class=HTMLResponse)
def auth_page(request: Request):
    template = templates.get_template("auth.html")
    return HTMLResponse(template.render(request=request))

@app.post("/register")
def register(username: str = Form(...),
             full_name: str = Form(...),
             email: str = Form(...),
             password: str = Form(...),
             db: Session = Depends(get_db)):

    user = User(
        username=username,
        full_name=full_name,
        email=email,
        password_hash=hash_password(password)
    )

    db.add(user)
    db.commit()

    return RedirectResponse("/auth", status_code=303)

@app.post("/login")
def login(request: Request,
          email: str = Form(...),
          password: str = Form(...),
          db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password_hash):
        return RedirectResponse("/auth", status_code=303)

    request.session["user"] = user.username
    request.session["admin"] = user.is_admin

    return RedirectResponse("/", status_code=303)

@app.get("/logout")
def logout(request: Request):
    request.session.clear()
    return RedirectResponse("/", status_code=303)
