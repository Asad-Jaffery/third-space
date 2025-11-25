from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users, spaces


app = FastAPI()

# allow frontend to call the API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(spaces.router)
app.include_router(reviews.router)


# basic activity check
@app.get("/")
def read_root():

    return {"status": "Backend is running"}
