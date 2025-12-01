from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from database import engine

router = APIRouter(prefix="/third_space", tags=["third space"])


class SpaceCreate(BaseModel):
    name: str
    description: str
    tags: str
    photo_url: str  # User will just paste a Google Image URL for now
    location_data: str  # Link to google maps for now


@router.post("/new")
    def create_space(space: SpaceCreate):
        try:
            with engine.connect() as conn:
                query = text(
                    """
                INSERT INTO spaces (name, description, tags, photo_url, location_data) 
                VALUES (:name, :desc, :tags, :url, :loc)
                RETURNING id
            """
            )

            params = {
                "name": space.name,
                "desc": space.description,
                "tags": space.tags,
                "url": space.photo_url,
                "loc": space.location_data,
            }
            result = conn.execute(query, params)
            conn.commit()

            new_id = result.mappings().first()
            return {"message": "Space created", "id": new_id["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
def list_spaces():
    """
    Return all spaces, newest first.
    """
    try:
        with engine.connect() as conn:
            query = text(
                """
                SELECT id, name, description, tags, photo_url, location_data, created_at
                FROM spaces
                ORDER BY created_at DESC
                """
            )
            result = conn.execute(query)
            spaces = [dict(row._mapping) for row in result.fetchall()]
            return {"spaces": spaces}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{space_id}")
def get_space(space_id: int):
    """
    Return a single space by id.
    """
    try:
        with engine.connect() as conn:
            query = text(
                """
                SELECT id, name, description, tags, photo_url, location_data, created_at
                FROM spaces
                WHERE id = :space_id
                """
            )
            result = conn.execute(query, {"space_id": space_id})
            space = result.mappings().first()
            if not space:
                raise HTTPException(status_code=404, detail="Space not found")
            return {"space": dict(space)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
