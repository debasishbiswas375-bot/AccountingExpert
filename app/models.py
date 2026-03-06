from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base


# -----------------------------
# PLANS TABLE
# -----------------------------
class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    credits = Column(Integer, default=0)
    price = Column(Float, default=0.0)
    duration_days = Column(Integer, default=30)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="plan")


# -----------------------------
# USERS TABLE
# -----------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)

    role = Column(String, default="user")  # user | co_admin | admin
    credits = Column(Integer, default=0)

    address = Column(String, nullable=True)
    contact = Column(String, nullable=True)

    is_active = Column(Boolean, default=True)
    is_deleted = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=True)

    plan = relationship("Plan", back_populates="users")
    logs = relationship("UserLog", back_populates="user")


# -----------------------------
# USER LOGS TABLE
# -----------------------------
class UserLog(Base):
    __tablename__ = "user_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    action = Column(String, nullable=False)
    metadata = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="logs")
