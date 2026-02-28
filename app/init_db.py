from app.database import engine, Base, SessionLocal
from app.models import Plan, User, SystemMeta
from app.auth import hash_password

def init_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    meta = db.query(SystemMeta).first()
    if not meta:
        db.add(SystemMeta(initialized=True))
        db.add_all([
            Plan(name="Basic", credits=100, price="Free", description="Starter Plan"),
            Plan(name="Pro", credits=1000, price="$19", description="Professional Plan"),
            Plan(name="Enterprise", credits=10000, price="$99", description="Enterprise Plan")
        ])
        db.add(User(
            email="admin@example.com",
            hashed_password=hash_password("admin123"),
            is_admin=True,
            credits=10000
        ))
        db.commit()
    db.close()
