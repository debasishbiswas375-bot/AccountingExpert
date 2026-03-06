from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import ConversionQueue
from ..auth_middleware import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/convert")

async def convert_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    # Temporary parsing simulation
    voucher_count = 50

    queue_job = ConversionQueue(
        user_id=user.id,
        voucher_count=voucher_count
    )

    db.add(queue_job)

    db.commit()

    return {
        "message": "Conversion added to queue",
        "vouchers": voucher_count
    }
