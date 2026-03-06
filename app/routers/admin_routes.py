from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

router = APIRouter()

templates = Jinja2Templates(directory="app/templates")


@router.get("/admin")
def admin_dashboard(request: Request):

    return templates.TemplateResponse(
        "admin.html",
        {
            "request": request,
            "total_users": 10,
            "total_conversions": 0,
            "total_plans": 3,
            "credits_used": 0
        }
    )
