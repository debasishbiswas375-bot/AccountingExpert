from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.init_db import init_database
from app.routers import dashboard, plans, help, auth_routes

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(dashboard.router)
app.include_router(plans.router)
app.include_router(help.router)
app.include_router(auth_routes.router)

@app.on_event("startup")
def startup():
    init_database()
