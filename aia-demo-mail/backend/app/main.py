from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import emails
from app.database.db import init_db

# Initialize FastAPI app
app = FastAPI(
    title="Email Application API",
    description="API for a simple email application with inbox and sent mail functionality",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(emails.router, prefix="/api", tags=["emails"])

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
async def root():
    return {"message": "Welcome to the Email Application API. Visit /docs for API documentation."} 