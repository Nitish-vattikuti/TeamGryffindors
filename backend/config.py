import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    SQLALCHEMY_DATABASE_URI = (
        f"sqlite:///infrasight.db"
    )  # We'll use SQLite now for simplicity
    SQLALCHEMY_TRACK_MODIFICATIONS = False
