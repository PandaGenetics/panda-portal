"""
Panda Genomics Portal - FastAPI Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import settings
from db.connection import engine, Base
from api import auth, users, genome, datasets, tools, pedigree, files


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create database tables
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown: Cleanup if needed
    pass


app = FastAPI(
    title="Panda Genomics Portal API",
    description="API for giant panda genomic data center",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(genome.router, prefix="/api/genome", tags=["Genome Browser"])
app.include_router(datasets.router, prefix="/api/datasets", tags=["Datasets"])
app.include_router(tools.router, prefix="/api/tools", tags=["Tools"])
app.include_router(pedigree.router, prefix="/api/pedigree", tags=["Pedigree"])
app.include_router(files.router, prefix="/api/files", tags=["Files"])


@app.get("/")
async def root():
    return {"message": "Panda Genomics Portal API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
