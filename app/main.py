import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# Import the logic branches
from app.routers import admin_routes, workspace_routes, history_routes, auth_routes

app = FastAPI(title="Accountesy Enterprise Pro")

# Get absolute path for reliability on Render
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Mount Static Files (CSS, Grayscale Watermark)
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

# Setup User Templates
user_templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

@app.get("/")
def home_dashboard(request: Request):
    # This serves the master layout as your homepage
    return user_templates.TemplateResponse("base.html", {"request": request})

# Connect the Routers
app.include_router(admin_routes.router)
app.include_router(workspace_routes.router)
app.include_router(history_routes.router)
app.include_router(auth_routes.router)
