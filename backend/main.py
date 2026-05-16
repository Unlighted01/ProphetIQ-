"""
ProphetIQ FastAPI Backend
AI-Powered Real Estate Intelligence Platform
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import predict
from backend.schemas.property import HealthResponse
from backend.services.predictor import load_artifacts, is_model_loaded


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML artifacts on startup."""
    print("[STARTUP] ProphetIQ API starting up...")
    load_artifacts()
    print("[READY] All artifacts loaded. API is ready.")
    yield
    print("[SHUTDOWN] ProphetIQ API shutting down.")


app = FastAPI(
    title="ProphetIQ API",
    description=(
        "AI-powered real estate intelligence platform. "
        "Predict house prices, get SHAP explanations, and receive AI-driven property advice."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allow Next.js frontend (dev + prod) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # Next.js dev
        "https://prophetiq.vercel.app",  # Production (update when deployed)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from backend.routers import predict, advisor, investment

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(predict.router, prefix="/api/v1")
app.include_router(advisor.router, prefix="/api/v1")
app.include_router(investment.router, prefix="/api/v1")


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/", response_model=HealthResponse, tags=["Health"])
async def root():
    return HealthResponse(
        status="ok",
        model_loaded=is_model_loaded(),
        version="PH-1.0.0",
    )


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health():
    return HealthResponse(
        status="ok",
        model_loaded=is_model_loaded(),
        version="PH-1.0.0",
    )
