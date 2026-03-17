import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# Import your logic branches
from app.routers import auth_routes, workspace_routes, history_routes, admin_routes

app = FastAPI(title="Accountesy Enterprise")

# Get the absolute path to the app directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 1. Mount Static Files (CSS, Images)
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

# 2. Setup User Templates (Strictly points to the app/templates folder)
user_templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# --- USER PAGE ENDPOINTS ---

@app.get("/")
def dashboard(request: Request):
    # Temporarily serving base.html until we design a specific dashboard
    return user_templates.TemplateResponse("base.html", {"request": request})

@app.get("/workspace")
def workspace(request: Request):
    # This serves the drag-and-drop converter you built!
    return user_templates.TemplateResponse("workspace.html", {"request": request})

@app.get("/history")
def history(request: Request):
    return user_templates.TemplateResponse("base.html", {"request": request})

# --- CONNECT THE LOGIC BRANCHES ---
app.include_router(auth_routes.router)
app.include_router(workspace_routes.router)
app.include_router(history_routes.router)
app.include_router(admin_routes.router)
