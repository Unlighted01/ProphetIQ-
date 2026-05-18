import os
import json
import logging
from fastapi import APIRouter, HTTPException, Request
import google.generativeai as genai
from dotenv import load_dotenv

from schemas.property import AdvisorRequest, AdvisorResponse

load_dotenv()
logger = logging.getLogger("prophetiq.advisor")

router = APIRouter(prefix="/advisor", tags=["Advisor"])

# ─── Gemini setup ─────────────────────────────────────────────────────────────

def _get_model():
    """Return a fresh Gemini model instance, or None if key is missing."""
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        logger.error("GEMINI_API_KEY is not set in environment variables.")
        return None
    try:
        genai.configure(api_key=key)
        return genai.GenerativeModel("gemini-2.5-flash")
    except Exception as e:
        logger.warning(f"Could not initialize Gemini client: {e}")
        return None


SYSTEM_PROMPT = """
You are a Chief Construction Engineer and Site Intelligence Expert for ProphetIQ, a firm operating in Pangasinan, Philippines.
Provide a technical construction assessment for a property in the target city with the following details provided in the context.

Your analysis should focus on:
1. **Site Suitability**: Technical evaluation of the location (e.g., flooding risks in Dagupan, San Fabian, and low-lying areas, soil type expectations).
2. **Structural Recommendations**: Advice on foundation types (e.g., elevated slabs for flood zones) and structural framing.
3. **Regulatory Context**: Mention local building code considerations or typical setbacks in this part of Pangasinan.
4. **Project Timeline**: Estimated construction duration for a project of this scale.

Be specific — reference the actual numbers and features.
Be honest about risks. Don't be vague. Avoid generic real estate clichés.
Assume the currency is Philippine Peso (PHP or ₱) and area is in square meters (sqm).

Always return your response as a valid JSON object matching this exact schema:
{
  "why_this_price": "explanation of the top 3 price drivers from SHAP data",
  "red_flags": ["specific concern 1", "specific concern 2"],
  "investment_take": "2-3 sentences on investment potential in this specific Philippine city",
  "recommendation": "BUY or HOLD or AVOID",
  "recommendation_reason": "one sentence explaining the recommendation"
}
Only return the JSON. No markdown formatting around it, no conversational filler.
"""


@router.post("/", response_model=AdvisorResponse)
async def get_property_advice(body: AdvisorRequest):
    """Get AI-powered construction & investment advice from Gemini."""
    active_model = _get_model()
    if not active_model:
        raise HTTPException(
            status_code=503,
            detail="Gemini AI is unavailable. Please ensure GEMINI_API_KEY is set in Railway environment variables.",
        )

    features = body.features
    prediction = body.prediction

    # Build prompt
    try:
        shap_text = "\n".join(
            [f"- {f['feature']}: ₱{f['impact']:+,.0f}" for f in (prediction.top_features or [])]
        )
    except Exception:
        shap_text = "(SHAP data unavailable)"

    user_prompt = f"""
{SYSTEM_PROMPT}

Analyze this property from a construction and engineering perspective for a potential project in {features.City}:

PROPERTY DETAILS:
- City/Region: {features.City}
- Property Type: {"Condo / Apartment" if features.IsCondo == 1 else "House & Lot / Townhouse"}
- Floor Area: {features.Floor_area_sqm} sqm
- Land Area: {features.Land_area_sqm} sqm
- Bedrooms: {features.Bedrooms}
- Bathrooms: {features.Bath}
- Coordinates: {features.Latitude}, {features.Longitude}

ML PREDICTION RESULTS:
- Predicted price: ₱{prediction.predicted_price_php:,.0f}
- Low estimate: ₱{prediction.price_range_low:,.0f}
- High estimate: ₱{prediction.price_range_high:,.0f}

TOP PRICE DRIVERS (SHAP analysis):
{shap_text}

Provide your engineering and site feasibility analysis as the requested JSON structure.
    """

    try:
        response = active_model.generate_content(
            user_prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
            ),
        )

        response_text = response.text.strip()

        # Strip markdown fences if present
        for fence in ("```json", "```"):
            if response_text.startswith(fence):
                response_text = response_text[len(fence):]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        parsed = json.loads(response_text.strip())
        return AdvisorResponse(**parsed)

    except Exception as e:
        logger.error(f"Gemini advisor failed: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=503,
            detail=f"AI analysis failed: {str(e)[:200]}",
        )


@router.get("/diagnose")
async def diagnose_gemini():
    """Diagnose the Gemini API setup and connection on the backend."""
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        return {
            "status": "error",
            "message": "GEMINI_API_KEY is not set in environment variables.",
            "keys_in_env": list(os.environ.keys())
        }

    masked_key = f"{key[:4]}...{key[-4:]}" if len(key) > 8 else "too_short"
    
    try:
        genai.configure(api_key=key)
        
        # Get list of supported models
        available_models = []
        try:
            for m in genai.list_models():
                available_models.append({
                    "name": m.name,
                    "supported_methods": m.supported_generation_methods,
                    "display_name": m.display_name
                })
        except Exception as list_err:
            available_models = [f"Failed to list models: {str(list_err)}"]

        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content("Say 'Gemini is online!'")
        
        return {
            "status": "success",
            "message": "Gemini connection test passed!",
            "key_length": len(key),
            "key_masked": masked_key,
            "available_models": available_models,
            "gemini_response": response.text.strip()
        }
    except Exception as e:
        return {
            "status": "failed",
            "message": "Failed to connect to Gemini API.",
            "key_length": len(key),
            "key_masked": masked_key,
            "available_models": available_models,
            "error_type": type(e).__name__,
            "error_detail": str(e)
        }


