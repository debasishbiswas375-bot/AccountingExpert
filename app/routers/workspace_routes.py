
from fastapi import APIRouter
router = APIRouter(prefix="/workspace")

@router.post("/convert")
def convert():
    return {"status":"conversion started"}
