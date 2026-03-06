from sqlalchemy import Column,Integer,String,Float,DateTime,ForeignKey
from sqlalchemy.orm import declarative_base
import datetime

Base = declarative_base()


class User(Base):

    __tablename__="users"

    id = Column(Integer,primary_key=True,index=True)

    username = Column(String,unique=True)
    email = Column(String,unique=True)

    password = Column(String)

    credits = Column(Float,default=0)

    created_at = Column(DateTime,default=datetime.datetime.utcnow)


class Plan(Base):

    __tablename__="plans"

    id = Column(Integer,primary_key=True)

    name = Column(String)

    credits = Column(Integer)

    price = Column(Float)

    duration_days = Column(Integer)


class Conversion(Base):

    __tablename__="conversions"

    id = Column(Integer,primary_key=True)

    user_id = Column(Integer,ForeignKey("users.id"))

    voucher_count = Column(Integer)

    credits_used = Column(Float)

    created_at = Column(DateTime,default=datetime.datetime.utcnow)
