from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter(prefix="/admin")

templates = Jinja2Templates(directory="app/templates")


# =========================
# ADMIN PAGE
# =========================
@router.get("/", response_class=HTMLResponse)
def admin_dashboard(request: Request):
    return templates.TemplateResponse("admin.html", {
        "request": request
    })


# =========================
# ADMIN API
# =========================
@router.get("/stats")
def stats():
    return {
        "users": 120,
        "files_processed": 430,
        "active_today": 12
    }
