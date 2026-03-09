import sys
import os

# This line fixes the 'ModuleNotFoundError' by adding the current path to Python
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.routers import auth, converter, admin, dashboard

app = FastAPI(title="Accountesy")

# Mount static files (logos, css)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize templates
templates = Jinja2Templates(directory="templates")

app.include_router(dashboard.router)
app.include_router(auth.router)
app.include_router(converter.router)
app.include_router(admin.router)

@app.get("/")
async def public_landing(request: Request):
    # Includes your footer: Created by Debasish Biswas
    return templates.TemplateResponse("landing.html", {"request": request})
