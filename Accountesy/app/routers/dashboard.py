from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from app.database import supabase

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/dashboard")
def dashboard(request: Request):

    plans = supabase.table("plans").select("*").execute()

    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "plans": plans.data
        }
    )


@router.get("/workspace")
def workspace(request: Request):
    return templates.TemplateResponse("workspace.html", {"request": request})


@router.get("/history")
def history(request: Request):
    history = supabase.table("conversion_history").select("*").execute()

    return templates.TemplateResponse(
        "history.html",
        {
            "request": request,
            "history": history.data
        }
    )


@router.get("/pricing")
def pricing(request: Request):

    plans = supabase.table("plans").select("*").execute()

    return templates.TemplateResponse(
        "pricing.html",
        {
            "request": request,
            "plans": plans.data
        }
    )


@router.get("/account")
def account(request: Request):
    return templates.TemplateResponse("account.html", {"request": request})
