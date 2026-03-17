import os
from fastapi import APIRouter, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from app.database import supabase

router = APIRouter(prefix="/admin")
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
admin_templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "admin"))

@router.get("/login")
def login_page(request: Request):
    return admin_templates.TemplateResponse("admin_login.html", {"request": request})

@router.post("/login")
def auth_admin(username: str = Form(...), password: str = Form(...)):
    if username == os.getenv("ADMIN_USERNAME") and password == os.getenv("ADMIN_PASSWORD"):
        return RedirectResponse(url="/admin/", status_code=302)
    return {"error": "Unauthorized"}

@router.get("/")
def dashboard(request: Request):
    res = supabase.table("users").select("*").execute()
    return admin_templates.TemplateResponse("admin_dashboard.html", {"request": request, "users": res.data})

@router.post("/update-user")
def update_user(user_id: str = Form(...), new_plan: str = Form(...)):
    supabase.table("users").update({"plan": new_plan}).eq("id", user_id).execute()
    return RedirectResponse(url="/admin/", status_code=302)
