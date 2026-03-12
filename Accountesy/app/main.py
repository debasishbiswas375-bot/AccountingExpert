import sys, os
from fastapi import FastAPI, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from database import supabase 
from dependencies import get_current_user

app = FastAPI()
# Secret key from your Render ENV
app.add_middleware(SessionMiddleware, secret_key=os.environ.get("SECRET_KEY", "accountesy-secure"))

app_dir = os.path.dirname(os.path.abspath(__file__)) 
root_dir = os.path.dirname(app_dir) 
app.mount("/static", StaticFiles(directory=os.path.join(root_dir, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(root_dir, "templates"))

# --- PAGE ROUTES ---

@app.get("/")
async def dashboard(request: Request, user=Depends(get_current_user)):
    """Dynamic user-wise data fetching"""
    user_record = supabase.table("users").select("*").eq("id", user.id).single().execute()
    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "user_name": user_record.data.get('full_name', 'User'),
        "credits": user_record.data.get('credits', 0.00)
    })

@app.get("/workspace")
async def workspace(request: Request):
    return templates.TemplateResponse("workspace.html", {"request": request})

@app.get("/history")
async def history(request: Request):
    return templates.TemplateResponse("history.html", {"request": request})

@app.get("/plans")
async def plans(request: Request):
    """Fetches the 4 plans from Supabase"""
    res = supabase.table("plans").select("*").eq("active", True).order("price").execute()
    return templates.TemplateResponse("pricing.html", {"request": request, "plans": res.data})

@app.get("/account")
async def account(request: Request):
    return templates.TemplateResponse("account.html", {"request": request})

@app.get("/admin")
async def admin(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request})
