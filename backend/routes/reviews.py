from fastapi import APIRouter, HTTPException
from database import engine
from sqlalchemy import text
from pydantic import BaseModel

# FIX 1: Use parentheses ()
router = APIRouter(prefix="/third_space", tags=["third space"])


class ReviewCreate(BaseModel):
    title: str
    description: str
    rating: int
    user_id: int
    space_id: int


@router.post("/new_review")
def create_review(review: ReviewCreate):
    try:
        with engine.connect() as conn:
            query = text(
                """
                INSERT INTO reviews (title, description, rating, user_id, space_id) 
                VALUES (:title, :description, :rating, :user_id, :space_id)
                RETURNING id, created_at
                """
            )
            params = {
                "title": review.title,
                "description": review.description,
                "rating": review.rating,
                "user_id": review.user_id,
                "space_id": review.space_id,
            }

            result = conn.execute(query, params)
            conn.commit()

            new_review = result.mappings().first()

            return {"message": "Review created", "id": new_review.id}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=400, detail="Error creating review")
