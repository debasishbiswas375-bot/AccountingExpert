import sys
import os

# 1. ROOT PATH FIX: Forces the app to see the 'Accountesy' folder correctly
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from bs4 import BeautifulSoup
import pandas as pd
import io

# Import routers after path fix
from routers import auth, converter, admin, dashboard

app = FastAPI(title="Accountesy")
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Register routers
app.include_router(dashboard.router)
app.include_router(auth.router)
app.include_router(converter.router)
app.include_router(admin.router)

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

@app.get("/pricing")
async def pricing(request: Request):
    return templates.TemplateResponse("pricing.html", {"request": request})

@app.get("/features")
async def features(request: Request):
    return templates.TemplateResponse("features.html", {"request": request})

@app.get("/account")
async def account(request: Request):
    return templates.TemplateResponse("account.html", {"request": request})

# --- CONVERSION TOOL ---
@app.post("/convert/process")
async def process_conversion(bank_file: UploadFile = File(...), master_file: UploadFile = File(...)):
    try:
        master_content = await master_file.read()
        soup = BeautifulSoup(master_content, "html.parser")
        tally_ledgers = [td.get_text().strip() for td in soup.find_all('td') if td.get_text().strip()]

        bank_content = await bank_file.read()
        df = pd.read_excel(io.BytesIO(bank_content))

        # Autonomous Mapping
        df['Suggested_Ledger'] = df.iloc[:, 1].apply(
            lambda x: next((l for l in tally_ledgers if l.lower() in str(x).lower()), "Suspense A/c")
        )

        return {"status": "Success", "mapped_count": len(df)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
