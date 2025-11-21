from fastapi import FastAPI
from routes import users, spaces


app = FastAPI()
app.include_router(users.router)
app.include_router(spaces.router)


# basic activity check
@app.get("/")
def read_root():

    return {"status": "Backend is running"}
