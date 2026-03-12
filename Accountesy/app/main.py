import sys, os, io
from fastapi import FastAPI, Request, UploadFile, File, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel
from starlette.middleware.sessions import SessionMiddleware

app_dir = os.path.dirname(os.path.abspath(__file__)) 
if app_dir not in sys.path: sys.path.append(app_dir)

from logic.processor import get_preview_data, generate_tally_xml, save_pattern
from database import supabase 

app = FastAPI(title="Accountesy AI")
app.add_middleware(SessionMiddleware, secret_key=os.environ.get("SECRET_KEY", "accountesy-secret"))

root_dir = os.path.dirname(app_dir) 
app.mount("/static", StaticFiles(directory=os.path.join(root_dir, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(root_dir, "templates"))

# --- ROUTES ---

@app.get("/")
async def landing(request: Request):
    return templates.TemplateResponse("landing.html", {"request": request})

@app.get("/login")
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/register")
async def register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.get("/dashboard")
async def dashboard(request: Request):
    try:
        # Fetching based on the email set in your Render ENV
        email = os.environ.get("ADMIN_EMAIL", "debasish.biswas375@gmail.com")
        user_data = supabase.table("users").select("credits").eq("email", email).single().execute()
        credits = user_data.data.get('credits', 0.00)
    except:
        credits = 0.00

    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "user_name": os.environ.get("ADMIN_USERNAME", "User"),
        "credits": credits,
        "vouchers_processed": 1248,
        "plan_name": "Pro Plan"
    })

@app.get("/pricing")
async def pricing(request: Request):
    try:
        # Fetches the 4 plans from your 'plans' table
        response = supabase.table("plans").select("*").eq("active", True).order("price").execute()
        plans = response.data
    except:
        plans = [] 
    return templates.TemplateResponse("pricing.html", {"request": request, "plans": plans})

@app.get("/admin")
async def admin_panel(request: Request):
    # Security check: Only deba1234 can enter
    if os.environ.get("ADMIN_USERNAME") != "deba1234":
        return RedirectResponse(url="/dashboard")
    return templates.TemplateResponse("admin.html", {"request": request})

# Workspace & API routes remain same as your provided main.py...
