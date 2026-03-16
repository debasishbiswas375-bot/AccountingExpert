
import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from .routers import auth_routes, workspace_routes, history_routes, admin_routes

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR,"static")), name="static")

templates = Jinja2Templates(directory=os.path.join(BASE_DIR,"templates"))

@app.get("/")
def landing(request: Request):
    return templates.TemplateResponse("landing.html", {"request": request})

@app.get("/features")
def features(request: Request):
    return templates.TemplateResponse("features.html", {"request": request})

@app.get("/pricing")
def pricing(request: Request):
    return templates.TemplateResponse("pricing.html", {"request": request})

@app.get("/dashboard")
def dashboard(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.get("/workspace")
def workspace(request: Request):
    return templates.TemplateResponse("workspace.html", {"request": request})

@app.get("/history")
def history(request: Request):
    return templates.TemplateResponse("history.html", {"request": request})

@app.get("/suggestions")
def suggestions(request: Request):
    return templates.TemplateResponse("suggestions.html", {"request": request})

app.include_router(auth_routes.router)
app.include_router(workspace_routes.router)
app.include_router(history_routes.router)
app.include_router(admin_routes.router)
