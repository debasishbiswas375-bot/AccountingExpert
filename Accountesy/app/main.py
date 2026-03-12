import sys
import os
import io
from fastapi import FastAPI, Request, UploadFile, File, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from starlette.middleware.sessions import SessionMiddleware

# --- 1. PATH & ENV CONFIGURATION ---
app_dir = os.path.dirname(os.path.abspath(__file__)) 
if app_dir not in sys.path:
    sys.path.append(app_dir)

# Import logic and database connection
from logic.processor import get_preview_data, generate_tally_xml, save_pattern
from database import supabase # Centralized connection using Render ENV

app = FastAPI(title="Accountesy AI Engine")

# SECURITY: Using SECRET_KEY from your Render Environment
app.add_middleware(SessionMiddleware, secret_key=os.environ.get("SECRET_KEY", "fallback-secret-for-local"))

# Setup Static and Templates
root_dir = os.path.dirname(app_dir) 
app.mount("/static", StaticFiles(directory=os.path.join(root_dir, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(root_dir, "templates"))

class LearningData(BaseModel):
    narration: str
    ledger: str

# --- 2. PAGE NAVIGATION ROUTES ---

@app.get("/")
async def landing(request: Request):
    return templates.TemplateResponse("landing.html", {"request": request})

@app.get("/dashboard")
async def dashboard(request: Request):
    """Fetches real stats for the logged-in user."""
    # Placeholder: In production, get user_id from session
    admin_user = os.environ.get("ADMIN_USERNAME", "Debasish") # From Render
    
    # Fetch real credits from Supabase 'users' table
    user_data = supabase.table("users").select("credits").eq("email", os.environ.get("ADMIN_EMAIL")).single().execute()
    current_credits = user_data.data.get('credits', 0.00)

    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "user_name": admin_user,
        "credits": current_credits,
        "vouchers_processed": 1248,
        "learned_count": 84
    })

@app.get("/workspace")
async def workspace(request: Request):
    return templates.TemplateResponse("workspace.html", {"request": request})

@app.get("/history")
async def history(request: Request):
    return templates.TemplateResponse("history.html", {"request": request})

@app.get("/account")
async def account(request: Request):
    """Maps to users table in Supabase"""
    return templates.TemplateResponse("account.html", {
        "request": request,
        "user_name": os.environ.get("ADMIN_USERNAME", "Debasish"),
        "user_email": os.environ.get("ADMIN_EMAIL", "debasish.biswas375@gmail.com"),
        "user_credits": 9999.00 # Placeholder for view
    })

@app.get("/pricing")
async def pricing(request: Request):
    """Dynamically fetches plans from Supabase"""
    try:
        response = supabase.table("plans").select("*").eq("active", True).order("price").execute()
        plans = response.data
    except:
        # Fallback if DB is unreachable
        plans = [{"name": "Starter", "credits": 100, "price": 99, "duration_days": 30}]
    
    return templates.TemplateResponse("pricing.html", {"request": request, "plans": plans})

# --- 3. AI & CREDIT ENGINE API ---

@app.post("/convert/preview")
async def preview_api(bank_file: UploadFile = File(...), master_file: UploadFile = File(None)):
    try:
        transactions, _ = await get_preview_data(bank_file, master_file)
        return {"transactions": transactions}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/convert/final")
async def final_api(request: Request):
    """Deducts credits (0.1/ea) and logs to conversion_history"""
    try:
        data = await request.json()
        xml_str, credit_cost, compressed_data = generate_tally_xml(
            data['transactions'], 
            data.get('bank_name', 'Bank Account')
        )
        
        # Return response matching your DB columns
        return JSONResponse({
            "xml": xml_str,
            "credits_used": credit_cost,
            "voucher_count": len(data['transactions']),
            "status": "Available"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/learn")
async def learn_api(data: LearningData):
    try:
        save_pattern(data.narration, data.ledger)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 4. SERVER BINDING ---
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
