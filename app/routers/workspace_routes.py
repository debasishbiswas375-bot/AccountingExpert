from fastapi import APIRouter, UploadFile, File
from app.services.parser import parse_excel

router = APIRouter()

@router.post("/convert")

async def convert(file: UploadFile = File(...)):

    vouchers = parse_excel(file.file)

    return {"vouchers":vouchers}
