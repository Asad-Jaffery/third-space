# db setup
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

# Load variables from the .env file
load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL not found. Did you create and populate the .env file?"
    )

# Create the engine
engine = create_engine(DATABASE_URL)
