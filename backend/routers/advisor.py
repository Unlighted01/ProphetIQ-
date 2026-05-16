import os
import json
from fastapi import APIRouter, HTTPException
import google.generativeai as genai
from dotenv import load_dotenv

from backend.schemas.property import AdvisorRequest, AdvisorResponse

load_dotenv()

router = APIRouter(prefix="/advisor", tags=["Advisor"])

# Configure the Gemini API client
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    # We will use gemini-1.5-flash as it's fast and generously free
    model = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    model = None
    print(f"Warning: Could not initialize Gemini client: {e}")

SYSTEM_PROMPT = """
You are ProphetIQ's AI real estate advisor — a sharp, data-savvy property analyst for the Philippine real estate market. 
You explain complex real estate valuations in clear, direct language for everyday buyers and investors.

You receive structured data about a property in the Philippines: its features, the ML model's predicted price (in PHP), 
the confidence interval, and the top SHAP feature impacts (what drove the price).

Your job is to translate this into actionable insights. Be specific — reference the actual numbers and features. 
Be honest about risks. Don't be vague. Avoid generic real estate clichés. 
Assume the currency is Philippine Peso (PHP or ₱) and area is in square meters (sqm).

Always return your response as a valid JSON object matching this exact schema:
{
  "summary": "2-3 sentence plain-English overview",
  "why_this_price": "explanation of the top 3 price drivers from SHAP data",
  "red_flags": ["specific concern 1", "specific concern 2"],
  "investment_take": "2-3 sentences on investment potential in this specific Philippine city",
  "recommendation": "BUY", "HOLD", or "AVOID",
  "recommendation_reason": "one sentence explaining the recommendation"
}
Only return the JSON. No markdown formatting around it, no conversational filler.
"""

@router.post("/", response_model=AdvisorResponse)
async def get_property_advice(request: AdvisorRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Gemini client is not initialized. Check API key.")

    features = request.features
    prediction = request.prediction

    # Build the prompt
    shap_text = "\n".join([f"- {f['feature']}: ₱{f['impact']:+,}" for f in prediction.top_features])
    
    user_prompt = f"""
{SYSTEM_PROMPT}

Analyze this property for a potential buyer in the Philippines:

PROPERTY DETAILS:
- City/Region: {features.City}
- Property Type: {"Condo / Apartment" if features.IsCondo == 1 else "House & Lot / Townhouse"}
- Floor Area: {features.Floor_area_sqm} sqm
- Land Area: {features.Land_area_sqm} sqm
- Bedrooms: {features.Bedrooms}
- Bathrooms: {features.Bath}
- Coordinates: {features.Latitude}, {features.Longitude}

ML PREDICTION RESULTS:
- Predicted price: ₱{prediction.predicted_price_php:,.2f}
- Low estimate: ₱{prediction.price_range_low:,.2f}
- High estimate: ₱{prediction.price_range_high:,.2f}

TOP PRICE DRIVERS (SHAP analysis):
{shap_text}

Provide your analysis as the requested JSON structure.
    """

    try:
        # Generate content with JSON enforcement
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(
                user_prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                )
            )
        except Exception as e:
            print(f"Failed with gemini-1.5-flash, falling back to gemini-pro: {e}")
            # Fallback to older gemini-pro model if 1.5-flash is not available in their region
            model = genai.GenerativeModel('gemini-pro')
            
            # gemini-pro does not natively support response_mime_type="application/json", 
            # so we just pass the prompt and let the system prompt enforce JSON
            response = model.generate_content(user_prompt)

        response_text = response.text.strip()
        
        # Strip markdown if gemini-pro wrapped it
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        parsed_response = json.loads(response_text)
        return AdvisorResponse(**parsed_response)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate AI advice: {str(e)}")
