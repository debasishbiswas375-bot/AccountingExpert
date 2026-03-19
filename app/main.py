import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# Routers
from app.routers import admin_routes, workspace_routes, history_routes, auth_routes

app = FastAPI(title="Accountesy Enterprise Pro")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Static files
app.mount(
    "/static",
    StaticFiles(directory=os.path.join(BASE_DIR, "static")),
    name="static"
)

# Templates
user_templates = Jinja2Templates(
    directory=os.path.join(BASE_DIR, "templates")
)


# ================= HOME =================
@app.get("/")
def home_dashboard(request: Request):

    # TEMP USER (until Supabase integration)
    user = {
        "username": "Guest",
        "plans": {
            "name": "Free"
        }
    }

    # EMPTY NOTIFICATIONS
    notifications = []

    return user_templates.TemplateResponse(
        "base.html",
        {
            "request": request,
            "user": user,
            "notifications": notifications
        }
    )


# ================= ROUTERS =================
app.include_router(admin_routes.router)
app.include_router(workspace_routes.router)
app.include_router(history_routes.router)
app.include_router(auth_routes.router)
