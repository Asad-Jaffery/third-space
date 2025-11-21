from fastapi import APIRouter, HTTPException
from pydantic import BaseModel  
from sqlalchemy import text    
from database import engine

router = APIRouter(
    prefix='/third_space',
    tags=["third space"]
)

class SpaceCreate(BaseModel):
    name: str
    description: str
    tags: str
    photo_url: str  # User will just paste a Google Image URL for now
    location_data: str # Link to google maps for now

# 2. Create a Third Space
@router.post("/new")
def create_space(space: SpaceCreate):
    try:
        with engine.connect() as conn:
            query = text("""
                INSERT INTO spaces (name, description, tags, photo_url, location_data) 
                VALUES (:name, :desc, :tags, :url, :loc)
                RETURNING id
            """)
            
            params = {
                "name": space.name,
                "desc": space.description,
                "tags": space.tags,
                "url": space.photo_url,
                "loc": space.location_data
            }
            result = conn.execute(query, params)
            conn.commit()
            
            new_id = result.mappings().first()
            return {"message": "Space created", "id": new_id['id']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))