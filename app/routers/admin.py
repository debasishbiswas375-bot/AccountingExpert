from fastapi import APIRouter

router=APIRouter(prefix="/admin")

@router.get("/")
def admin_dashboard():
 return {"users":130,"conversions":900}
