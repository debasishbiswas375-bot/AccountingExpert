from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Plan(Base):
    __tablename__ = "plans"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    credits = Column(Integer)
    price = Column(String)
    description = Column(String)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)
    credits = Column(Integer, default=0)
    plan_id = Column(Integer, ForeignKey("plans.id"))
    plan = relationship("Plan")

class SystemMeta(Base):
    __tablename__ = "system_meta"
    id = Column(Integer, primary_key=True)
    initialized = Column(Boolean, default=False)
