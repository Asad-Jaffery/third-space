from fastapi import APIRouter, HTTPException
from database import engine
from pydantic import BaseModel
from sqlalchemy import text


router = APIRouter(prefix="/user", tags=["users"])


class UserCreate(BaseModel):
    email: str
    username: str


@router.post("/new")
def create_user(user: UserCreate):
    try:
        with engine.connect() as conn:
            query = text(
                """
                INSERT INTO users (email, username) 
                VALUES (:email, :username)
                RETURNING id, created_at
            """
            )
            params = {"email": user.email, "username": user.username}
            result = conn.execute(query, params)
            conn.commit()

            # Return the ID of the new user
            new_user = result.mappings().first()
            return {"message": "User created", "user": new_user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
