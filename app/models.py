from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    credits = Column(Float)
    price = Column(Float)
    duration_days = Column(Integer)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)

    credits = Column(Float, default=0)

    plan_id = Column(Integer, ForeignKey("plans.id"))
    plan = relationship("Plan")

    created_at = Column(DateTime, default=datetime.utcnow)


class ConversionHistory(Base):
    __tablename__ = "conversion_history"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    voucher_count = Column(Integer)

    credits_used = Column(Float)

    converted_date = Column(DateTime, default=datetime.utcnow)


class ConversionQueue(Base):
    __tablename__ = "conversion_queue"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer)

    voucher_count = Column(Integer)

    status = Column(String, default="pending")

    created_at = Column(DateTime, default=datetime.utcnow)
