import os
from supabase import create_client

# Read from Render environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_JWT_SECRET")

# Create Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# PostgreSQL database connection (optional)
DATABASE_URL = os.getenv("DATABASE_URL")

# Admin credentials
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")

# Secret key
SECRET_KEY = os.getenv("SECRET_KEY")
