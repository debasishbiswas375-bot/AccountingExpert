from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.routers import admin_routes
from app.routers import auth_routes
from app.routers import workspace_routes
from app.routers import history_routes
from app.routers import plans_routes

app = FastAPI()

templates = Jinja2Templates(directory="app/templates")

app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.get("/")
def dashboard(request: Request):

    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "credits": None,
            "conversions": 0,
            "plan": None
        }
    )


app.include_router(admin_routes.router)
app.include_router(auth_routes.router)
app.include_router(workspace_routes.router)
app.include_router(history_routes.router)
app.include_router(plans_routes.router)
