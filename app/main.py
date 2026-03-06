from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import threading
import os

from .database import Base, engine
from .queue_worker import process_queue

from .routers import workspace_routes
from .routers import history_routes
from .routers import auth_routes
from .routers import admin_routes

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

templates = Jinja2Templates(directory=TEMPLATE_DIR)

Base.metadata.create_all(bind=engine)

app.include_router(workspace_routes.router)
app.include_router(history_routes.router)
app.include_router(auth_routes.router)
app.include_router(admin_routes.router)


@app.on_event("startup")
def start_queue_worker():

    thread = threading.Thread(target=process_queue)

    thread.daemon = True

    thread.start()
