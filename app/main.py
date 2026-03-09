from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routers import pages,auth,dashboard,convert,plans,admin

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(pages.router)
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(convert.router)
app.include_router(plans.router)
app.include_router(admin.router)
