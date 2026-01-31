# config.py
import os
from dotenv import load_dotenv
import psycopg2


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:wneQIWsDoGHoCTF3@db.aonyymlnfvdtzaawgeid.supabase.co:5432/postgres"
)

ACCESS_TOKEN_EXPIRE_MINUTES = 60

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable not set")
