"""
ProphetIQ FastAPI Backend — Predict Router
"""
from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from schemas.property import PropertyFeatures, PredictionResponse
from services.predictor import predict_price

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/predict", tags=["Prediction"])

CONFIDENCE_MARGIN = 0.10  # ±10% price range


@router.post("/", response_model=PredictionResponse, summary="Predict House Price")
@limiter.limit("15/minute")
async def predict(request: Request, features: PropertyFeatures):
    """
    Submit house features and receive an AI-predicted sale price
    along with the top contributing SHAP factors.
    """
    try:
        features_dict = features.model_dump(by_alias=True)
        price, top_features = predict_price(features_dict)

        return PredictionResponse(
            predicted_price_php=round(price, 2),
            price_range_low=round(price * (1 - CONFIDENCE_MARGIN), 2),
            price_range_high=round(price * (1 + CONFIDENCE_MARGIN), 2),
            top_features=top_features,
            model_version="PH-1.1.0",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
