from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    price = Column(Integer)
    credits = Column(Integer)
    description = Column(String)

    users = relationship("User", back_populates="plan")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user")
    credits = Column(Integer, default=0)
    plan_id = Column(Integer, ForeignKey("plans.id"))

    plan = relationship("Plan", back_populates="users")

