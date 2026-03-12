import sys
import os
import io
from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import StreamingResponse

# --- 1. PATH CONFIGURATION ---
app_dir = os.path.dirname(os.path.abspath(__file__)) 
if app_dir not in sys.path:
    sys.path.append(app_dir)

# Import automation functions (to be created in File 2)
from logic.processor import get_preview_data, generate_tally_xml

app = FastAPI(title="Accountesy")

# Configure paths for CSS, Images, and HTML templates
root_dir = os.path.dirname(app_dir) 
app.mount("/static", StaticFiles(directory=os.path.join(root_dir, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(root_dir, "templates"))

# --- 2. FULL NAVIGATION ROUTES (Matching your Template folder) ---

@app.get("/")
async def landing(request: Request):
    """Home / Features page"""
    return templates.TemplateResponse("landing.html", {"request": request})

@app.get("/login")
async def login(request: Request):
    """User login page"""
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/register")
async def register(request: Request):
    """User registration page"""
    return templates.TemplateResponse("register.html", {"request": request})

@app.get("/workspace")
async def workspace(request: Request):
    """Main Tally conversion area"""
    return templates.TemplateResponse("workspace.html", {"request": request})

@app.get("/dashboard")
async def dashboard(request: Request):
    """User Dashboard overview"""
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.get("/history")
async def history(request: Request):
    """Past conversions history"""
    return templates.TemplateResponse("history.html", {"request": request})

@app.get("/account")
async def account(request: Request):
    """Profile & Bank settings"""
    return templates.TemplateResponse("account.html", {"request": request})

@app.get("/pricing")
async def pricing(request: Request):
    """Subscription plans"""
    return templates.TemplateResponse("pricing.html", {"request": request})

@app.get("/admin")
async def admin_panel(request: Request):
    """System Admin panel"""
    return templates.TemplateResponse("admin.html", {"request": request})

# --- 3. THE AI DATA PROCESSING ROUTES ---

@app.post("/convert/preview")
async def preview_logic(bank_file: UploadFile = File(...), master_file: UploadFile = File(...)):
    """AI classification and Voucher Date recovery logic"""
    try:
        preview_results, masters = await get_preview_data(bank_file, master_file)
        return {"transactions": preview_results, "master_ledgers": masters}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/convert/final")
async def final_export(request: Request):
    """Generate final XML for Tally"""
    try:
        data = await request.json()
        xml_data = generate_tally_xml(data['transactions'])
        return StreamingResponse(
            io.BytesIO(xml_data.encode('utf-8')), 
            media_type="application/xml",
            headers={"Content-Disposition": "attachment; filename=Accountesy_Import.xml"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- 4. RENDER PORT FIX ---
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
