import os
import threading

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .database import Base, engine
from .queue_worker import process_queue

from .routers import workspace_routes
from .routers import history_routes
from .routers import auth_routes
from .routers import admin_routes


# ----------------------------
# Create FastAPI app
# ----------------------------

app = FastAPI()


# ----------------------------
# Paths
# ----------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")


# ----------------------------
# Static Files
# ----------------------------

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# ----------------------------
# Templates
# ----------------------------

templates = Jinja2Templates(directory=TEMPLATE_DIR)


# ----------------------------
# Create Database Tables
# ----------------------------

Base.metadata.create_all(bind=engine)


# ----------------------------
# Include Routers
# ----------------------------

app.include_router(auth_routes.router)
app.include_router(workspace_routes.router)
app.include_router(history_routes.router)
app.include_router(admin_routes.router)


# ----------------------------
# Dashboard Route
# ----------------------------

@app.get("/", response_class=HTMLResponse)
def dashboard(request: Request):

    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request
        }
    )


# ----------------------------
# Start Conversion Queue Worker
# ----------------------------

@app.on_event("startup")
def start_queue_worker():

    worker = threading.Thread(target=process_queue)

    worker.daemon = True

    worker.start()


# ----------------------------
# Health Check Route
# ----------------------------

@app.get("/health")
def health():
    return {"status": "ok"}
