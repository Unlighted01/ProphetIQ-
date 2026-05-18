"""
ProphetIQ FastAPI Backend
"""
from contextlib import asynccontextmanager
import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict, advisor, investment
from schemas.property import HealthResponse
from services.predictor import load_artifacts, is_model_loaded

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[STARTUP] ProphetIQ API starting up...")
    load_artifacts()
    print("[READY] All artifacts loaded.")
    yield
    print("[SHUTDOWN] Shutting down.")

app = FastAPI(
    title="ProphetIQ API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api/v1")
app.include_router(advisor.router, prefix="/api/v1")
app.include_router(investment.router, prefix="/api/v1")

@app.get("/", response_model=HealthResponse, tags=["Health"])
async def root():
    return HealthResponse(status="ok", model_loaded=is_model_loaded(), version="PH-1.0.0")

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health():
    return HealthResponse(status="ok", model_loaded=is_model_loaded(), version="PH-1.0.0")
