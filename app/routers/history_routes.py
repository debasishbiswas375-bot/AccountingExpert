
from fastapi import APIRouter
router = APIRouter(prefix="/history")

@router.get("/list")
def history():
    return {"history":[]}
