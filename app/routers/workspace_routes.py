from fastapi import APIRouter, UploadFile, File

router = APIRouter(prefix="/workspace", tags=["Workspace"])

@router.post("/convert")
async def convert_file(file: UploadFile = File(...)):
    # Read the file into memory
    file_bytes = await file.read()
    file_size = len(file_bytes)
    
    # Right now, it just acknowledges receipt. 
    # Next, we will add the Pandas code here to process the Excel data!
    return {
        "status": "success", 
        "message": "File received by the server!", 
        "filename": file.filename,
        "bytes_processed": file_size
    }
