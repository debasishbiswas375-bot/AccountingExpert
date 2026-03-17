from fastapi import APIRouter, UploadFile, File, Request, Form
from fastapi.templating import Jinja2Templates
from app.tools.mapper import smart_map_bank
from app.tools.engine import smart_classify
from app.tools.preview import get_preview_and_cost
import os

router = APIRouter(prefix="/workspace", tags=["Workspace"])
templates = Jinja2Templates(directory="app/templates")

@router.post("/upload")
async def upload_file(request: Request, file: UploadFile = File(...)):
    # 1. Standardize Bank Columns
    content = await file.read()
    df = smart_map_bank(content, file.filename)
    
    # 2. Run AI Classification (Using a hardcoded user_id for now)
    user_id = "debasish_pro_user" 
    df = smart_classify(df, user_id)
    
    # 3. Get Preview & Cost
    analysis = get_preview_and_cost(df)
    
    return templates.TemplateResponse("workspace_preview.html", {
        "request": request,
        "filename": file.filename,
        "total_rows": analysis['total_rows'],
        "cost": analysis['credit_cost'],
        "preview": analysis['preview_data']
    })
