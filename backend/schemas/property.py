"""
ProphetIQ FastAPI Backend — Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional


class PropertyFeatures(BaseModel):
    """Input schema for Philippine property price prediction."""

    Bedrooms: int = Field(2, ge=1, le=20, description="Number of bedrooms")
    Bath: int = Field(1, ge=1, le=10, description="Number of bathrooms")
    Floor_area_sqm: float = Field(
        50.0, ge=10, le=5000,
        description="Total floor area in square meters",
        alias="Floor_area (sqm)"
    )
    Land_area_sqm: float = Field(
        0.0, ge=0, le=10000,
        description="Total land area in square meters (0 for condos)",
        alias="Land_area (sqm)"
    )
    City: str = Field("Lingayen", min_length=2, max_length=100, description="City location in the Philippines")

    # Optional / Advanced
    Latitude: float = Field(16.02, ge=4.0, le=21.0, description="Latitude coordinate (Philippines range)")
    Longitude: float = Field(120.23, ge=116.0, le=127.0, description="Longitude coordinate (Philippines range)")
    IsCondo: int = Field(1, ge=0, le=1, description="1 if Condo/Apartment, 0 if House and Lot")

    class Config:
        populate_by_name = True


class PredictionResponse(BaseModel):
    """Response schema for a PHP price prediction."""
    predicted_price_php: float = Field(..., description="Predicted sale price in PHP")
    price_range_low: float = Field(..., description="Lower bound of confidence interval")
    price_range_high: float = Field(..., description="Upper bound of confidence interval")
    top_features: list = Field(..., description="Top SHAP feature importances")
    model_version: str = Field("PH-1.0.0", description="Model version")


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str


class AdvisorRequest(BaseModel):
    """Schema for requesting AI property advice."""
    features: PropertyFeatures
    prediction: PredictionResponse


class AdvisorResponse(BaseModel):
    """Structured JSON response from the AI Advisor."""
    why_this_price: str
    red_flags: list[str]
    investment_take: str
    recommendation: str
    recommendation_reason: str

    # summary is optional — Gemini doesn't always return it
    summary: Optional[str] = None


class InvestmentRequest(BaseModel):
    """Schema for requesting investment metrics."""
    predicted_price_php: float = Field(..., gt=0)
    down_payment_pct: float = Field(0.20, ge=0.05, le=0.80, description="Down payment percentage (e.g. 0.20 for 20%)")
    mortgage_rate: float = Field(0.08, ge=0.01, le=0.30, description="Annual interest rate (e.g. 0.08 for 8%)")
    mortgage_years: int = Field(20, ge=1, le=30, description="Loan term in years")


class InvestmentResponse(BaseModel):
    """Schema for investment metric response."""
    monthly_payment_php: float
    estimated_monthly_rent_php: float
    gross_rental_yield_pct: float
    annual_cash_flow_php: float
    roi_5yr_pct: float
