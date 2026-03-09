from fastapi import APIRouter, UploadFile, File
import pandas as pd

router = APIRouter()

@router.post("/convert")
async def convert_statement(file: UploadFile = File(...)):
    
    df = pd.read_excel(file.file)

    vouchers = len(df)

    return {
        "status": "converted",
        "voucher_count": vouchers
    }
