import os
from supabase import create_client, Client

db_url = os.environ.get("DATABASE_URL", "")
generated_url = None

# Extracting the API URL from the Postgres string
if "supabase.com" in db_url:
    try:
        # Format: postgresql://postgres.[ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
        project_id = db_url.split('@')[-1].split('.')[0].replace("aws-0-", "")
        generated_url = f"https://{project_id}.supabase.co"
    except Exception:
        generated_url = os.environ.get("SUPABASE_URL") # Fallback to manual ENV if extraction fails
else:
    generated_url = os.environ.get("SUPABASE_URL")

# Using SECRET_KEY as the API Key per your existing Render setup
api_key = os.environ.get("SECRET_KEY")

if not generated_url or not api_key:
    print("❌ ERROR: Supabase URL or API Key missing. Check Render Environment Variables.")

# Standard clients
supabase: Client = create_client(generated_url, api_key)
supabase_admin: Client = create_client(generated_url, api_key)
