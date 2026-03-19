from fastapi import APIRouter, Request, Form
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

# Fake DB (replace later with Supabase)
USERS = {
    "admin": "1234"
}

# =========================
# PAGE
# =========================
@router.get("/login")
def login_page(request: Request):
    return templates.TemplateResponse("auth.html", {"request": request})


# =========================
# LOGIN
# =========================
@router.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    if username in USERS and USERS[username] == password:
        response = RedirectResponse(url="/dashboard", status_code=302)
        response.set_cookie(key="user", value=username)
        return response

    return {"error": "Invalid credentials"}


# =========================
# LOGOUT
# =========================
@router.get("/logout")
def logout():
    response = RedirectResponse(url="/")
    response.delete_cookie("user")
    return response
