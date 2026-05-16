from pydantic import BaseModel, Field
from typing import Optional


class PropertyFeatures(BaseModel):
    """Input schema for Philippine property price prediction."""

    Bedrooms: int = Field(2, description="Number of bedrooms")
    Bath: int = Field(1, description="Number of bathrooms")
    Floor_area_sqm: float = Field(50.0, description="Total floor area in square meters", alias="Floor_area (sqm)")
    Land_area_sqm: float = Field(0.0, description="Total land area in square meters (0 for condos)", alias="Land_area (sqm)")
    City: str = Field("Pasig", description="City location in the Philippines")
    
    # Optional / Advanced
    Latitude: float = Field(14.58, description="Latitude coordinate")
    Longitude: float = Field(121.06, description="Longitude coordinate")
    IsCondo: int = Field(1, description="1 if Condo/Apartment, 0 if House and Lot")

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
    """Schema for requesting AI advice from Claude."""
    features: PropertyFeatures
    prediction: PredictionResponse


class AdvisorResponse(BaseModel):
    """Structured JSON response expected from Claude."""
    summary: str
    why_this_price: str
    red_flags: list[str]
    investment_take: str
    recommendation: str
    recommendation_reason: str

class InvestmentRequest(BaseModel):
    """Schema for requesting investment metrics."""
    predicted_price_php: float
    down_payment_pct: float = Field(0.20, description="Down payment percentage (e.g. 0.20 for 20%)")
    mortgage_rate: float = Field(0.08, description="Annual interest rate (e.g. 0.08 for 8%)")
    mortgage_years: int = Field(20, description="Loan term in years")


class InvestmentResponse(BaseModel):
    """Schema for investment metric response."""
    monthly_payment_php: float
    estimated_monthly_rent_php: float
    gross_rental_yield_pct: float
    annual_cash_flow_php: float
    roi_5yr_pct: float
