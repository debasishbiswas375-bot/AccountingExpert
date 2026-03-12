import sys, os
from fastapi import FastAPI, Request, UploadFile, File, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware

app_dir = os.path.dirname(os.path.abspath(__file__)) 
if app_dir not in sys.path: sys.path.append(app_dir)

from logic.processor import get_preview_data, generate_tally_xml, save_pattern
from database import supabase 
from dependencies import get_current_user # Dynamic Auth Gate

app = FastAPI(title="Accountesy AI")
app.add_middleware(SessionMiddleware, secret_key=os.environ.get("SECRET_KEY", "accountesy-secure"))

root_dir = os.path.dirname(app_dir) 
app.mount("/static", StaticFiles(directory=os.path.join(root_dir, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(root_dir, "templates"))

# --- ROUTES ---

@app.get("/")
async def landing(request: Request):
    return templates.TemplateResponse("landing.html", {"request": request})

@app.get("/login")
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/register")
async def register(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.get("/dashboard")
async def dashboard(request: Request, user=Depends(get_current_user)):
    # FETCH USER-WISE DATA: No more manual placeholders
    user_data = supabase.table("users").select("*").eq("id", user.id).single().execute()
    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "user_name": user_data.data.get('full_name', 'User'),
        "credits": user_data.data.get('credits', 0.00)
    })

@app.get("/workspace")
async def workspace(request: Request, user=Depends(get_current_user)):
    return templates.TemplateResponse("workspace.html", {"request": request})

@app.get("/pricing")
async def pricing(request: Request):
    # DYNAMIC: Fetch the 4 plans from Supabase
    res = supabase.table("plans").select("*").eq("active", True).order("price").execute()
    return templates.TemplateResponse("pricing.html", {"request": request, "plans": res.data})

@app.get("/admin")
async def admin(request: Request, user=Depends(get_current_user)):
    # Security: Only your specific ID can enter
    if user.email != os.environ.get("ADMIN_EMAIL"):
        return RedirectResponse(url="/dashboard")
    return templates.TemplateResponse("admin.html", {"request": request})
