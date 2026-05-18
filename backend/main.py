"""
ProphetIQ FastAPI Backend
"""
from contextlib import asynccontextmanager
import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from routers import predict, advisor, investment
from schemas.property import HealthResponse
from services.predictor import load_artifacts, is_model_loaded

# Structured logging — no more bare print()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger("prophetiq")

# Allowed frontend origins — lock down CORS
ALLOWED_ORIGINS = [
    "https://prophet-iq.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("[STARTUP] ProphetIQ API starting up...")
    load_artifacts()
    logger.info("[READY] All artifacts loaded. API is live.")
    yield
    logger.info("[SHUTDOWN] Shutting down.")

# Rate limiter — shared across all routers
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

app = FastAPI(
    title="ProphetIQ API",
    description="Philippine Real Estate Price Prediction & Investment Intelligence",
    version="1.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Register rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Accept"],
)

app.include_router(predict.router, prefix="/api/v1")
app.include_router(advisor.router, prefix="/api/v1")
app.include_router(investment.router, prefix="/api/v1")

@app.get("/", response_model=HealthResponse, tags=["Health"])
async def root():
    return HealthResponse(status="ok", model_loaded=is_model_loaded(), version="PH-1.1.0")

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health():
    return HealthResponse(status="ok", model_loaded=is_model_loaded(), version="PH-1.1.0")
