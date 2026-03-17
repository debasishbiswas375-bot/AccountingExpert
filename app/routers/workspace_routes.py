from fastapi import APIRouter, UploadFile, File
router = APIRouter(prefix="/workspace", tags=["Workspace"])

@router.post("/convert")
async def process_bank_statement(file: UploadFile = File(...)):
    # This is where your Pandas magic will go next!
    return {"filename": file.filename, "status": "Pro processing started"}
