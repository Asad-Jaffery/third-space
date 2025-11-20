from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from typing import Dict, Any
from database import engine

app = FastAPI()

# --- PYDANTIC MODELS (Data Validation) ---
# These check data coming FROM the frontend before it touches your logic.

class UserCreate(BaseModel):
    email: str
    username: str

class SpaceCreate(BaseModel):
    name: str
    description: str
    tags: str
    photo_url: str  # User will just paste a Google Image URL for now
    location_data: str # Link to google maps for now

# --- API ROUTES ---

@app.get("/")
def read_root():
    return {"status": "Backend is running"}

# 1. Create a User
@app.post("/users/")
def create_user(user: UserCreate):
    try:
        with engine.connect() as conn:
            query = text("""
                INSERT INTO users (email, username) 
                VALUES (:email, :username)
                RETURNING id, created_at
            """)
            result = conn.execute(query, {"email": user.email, "username": user.username})
            conn.commit()
            
            # Return the ID of the new user
            new_user = result.mappings().first()
            return {"message": "User created", "user": new_user}
    except Exception as e:
        # Capture errors (like duplicate email)
        raise HTTPException(status_code=400, detail=str(e))

# 2. Create a Third Space
@app.post("/spaces/")
def create_space(space: SpaceCreate):
    try:
        with engine.connect() as conn:
            # Note: SQLAlchemy automatically converts the location_data dict to JSONB
            query = text("""
                INSERT INTO spaces (name, description, tags, photo_url, location_data) 
                VALUES (:name, :desc, :tags, :url, :loc)
                RETURNING id
            """)
            
            result = conn.execute(query, {
                "name": space.name,
                "desc": space.description,
                "tags": space.tags,
                "url": space.photo_url,
                "loc": space.location_data
            })
            conn.commit()
            
            new_id = result.mappings().first()
            return {"message": "Space created", "id": new_id['id']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. Get All Spaces
@app.get("/spaces/")
def get_spaces():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM spaces ORDER BY id DESC"))
        return result.mappings().all()