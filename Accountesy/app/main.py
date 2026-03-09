import sys
import os

# DO NOT REMOVE: This fixes the ModuleNotFoundError on Render
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.routers import auth, converter, admin, dashboard

app = FastAPI(title="Accountesy")

# Mount static files for your logos and style.css
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

app.include_router(dashboard.router)
app.include_router(auth.router)
app.include_router(converter.router)
app.include_router(admin.router)

@app.get("/")
async def public_landing(request: Request):
    # This serves your premium landing page with the Debasish Biswas footer
    return templates.TemplateResponse("landing.html", {"request": request})
