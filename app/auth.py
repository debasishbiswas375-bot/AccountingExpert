from passlib.context import CryptContext
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=[""bcrypt""], deprecated=""auto"")

SECRET_KEY = os.getenv(""SECRET_KEY"")
ALGORITHM = ""HS256""

def get_password_hash(password: str):
    return pwd_context.hash(password[:72])

def verify_password(plain, hashed):
    return pwd_context.verify(plain[:72], hashed)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=1)
    to_encode.update({""exp"": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
