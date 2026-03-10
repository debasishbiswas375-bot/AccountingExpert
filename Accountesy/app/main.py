import sys
import os
from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# --- 1. ABSOLUTE PATH FIX ---
# This finds the folder where THIS main.py lives and adds it to the system path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# --- 2. DYNAMIC TEMPLATE PATH FIX ---
# This ensures Jinja2 looks inside YOUR specific templates folder
template_path = os.path.join(current_dir, "templates")
static_path = os.path.join(current_dir, "static")

from bs4 import BeautifulSoup
import pandas as pd
import io

# Import your routers (now that the path is fixed)
try:
    from routers import auth, converter, admin, dashboard
except ImportError:
    # Fallback for different directory structures
    from Accountesy.app.routers import auth, converter, admin, dashboard

app = FastAPI(title="Accountesy")

# Mount using the absolute paths we calculated above
app.mount("/static", StaticFiles(directory=static_path), name="static")
templates = Jinja2Templates(directory=template_path)

# Register routers
app.include_router(dashboard.router)
app.include_router(auth.router)

# --- ROUTES ---
@app.get("/")
async def public_landing(request: Request):
    return templates.TemplateResponse("landing.html", {"request": request})

@app.get("/workspace")
async def workspace(request: Request):
    return templates.TemplateResponse("workspace.html", {"request": request})

@app.get("/history")
async def history(request: Request):
    return templates.TemplateResponse("history.html", {"request": request})

@app.post("/convert/process")
async def process_conversion(bank_file: UploadFile = File(...), master_file: UploadFile = File(...)):
    try:
        master_content = await master_file.read()
        soup = BeautifulSoup(master_content, "html.parser")
        tally_ledgers = [td.get_text().strip() for td in soup.find_all('td') if td.get_text().strip()]
        return {"status": "Success", "ledgers": len(tally_ledgers)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
