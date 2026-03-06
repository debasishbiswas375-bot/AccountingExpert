import time
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import ConversionQueue, User, ConversionHistory

CREDIT_PER_VOUCHER = 0.1


def process_queue():

    while True:

        db: Session = SessionLocal()

        job = db.query(ConversionQueue)\
                .filter(ConversionQueue.status == "pending")\
                .first()

        if job:

            user = db.query(User).filter(User.id == job.user_id).first()

            credits_required = job.voucher_count * CREDIT_PER_VOUCHER

            if user.credits >= credits_required:

                user.credits -= credits_required

                history = ConversionHistory(
                    user_id=user.id,
                    voucher_count=job.voucher_count,
                    credits_used=credits_required
                )

                db.add(history)

                job.status = "completed"

            else:

                job.status = "failed"

            db.commit()

        db.close()

        time.sleep(3)
