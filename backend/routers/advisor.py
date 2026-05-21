import os
import json
import logging
import asyncio
import httpx
from fastapi import APIRouter, HTTPException, Request
import google.generativeai as genai
from dotenv import load_dotenv

from schemas.property import AdvisorRequest, AdvisorResponse

load_dotenv()
logger = logging.getLogger("prophetiq.advisor")

router = APIRouter(prefix="/advisor", tags=["Advisor"])

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
  "summary": "2-3 sentence plain-English overview of this property and site in Pangasinan",
  "why_this_price": "explanation of the top 3 price drivers from SHAP data",
  "red_flags": ["specific concern 1", "specific concern 2"],
  "investment_take": "2-3 sentences on investment potential in this specific Philippine city",
  "recommendation": "BUY or HOLD or AVOID",
  "recommendation_reason": "one sentence explaining the recommendation",
  "geotechnical_assessment": "Geotechnical / soil hazard evaluation (e.g. flood probability, liquefaction zone warning if in Dagupan/Calasiao, sand content)",
  "structural_advice": "Civil/structural framing recommendations (e.g. standard reinforced concrete, structural steel, elevated floor slab level, pile foundations)",
  "regulatory_notes": "Building permits, easement setbacks (Pangasinan local rules), zoning compliance",
  "project_timeline": "Estimated project schedule (e.g. '6-8 Months' or '10-12 Months' based on size)"
}
Only return the JSON. No markdown formatting around it, no conversational filler.
"""

def _parse_json(text: str) -> AdvisorResponse:
    """Robust extraction and parsing of the JSON block from LLM output."""
    start_idx = text.find("{")
    end_idx = text.rfind("}")
    if start_idx == -1 or end_idx == -1:
        raise ValueError("Could not find valid JSON object boundaries in response text.")
    
    json_str = text[start_idx:end_idx+1]
    parsed_dict = json.loads(json_str)
    
    # Ensure all required fields exist or set safe defaults to prevent runtime errors
    required_fields = {
        "summary": "AI advisor summary unavailable.",
        "why_this_price": "Price driver analysis unavailable.",
        "red_flags": [],
        "investment_take": "Investment notes unavailable.",
        "recommendation": "HOLD",
        "recommendation_reason": "Advice details unavailable.",
        "geotechnical_assessment": "Geotechnical notes unavailable.",
        "structural_advice": "Structural framing details unavailable.",
        "regulatory_notes": "Zoning details unavailable.",
        "project_timeline": "6-8 Months"
    }
    
    for field, default in required_fields.items():
        if field not in parsed_dict or parsed_dict[field] is None:
            parsed_dict[field] = default
            
    return AdvisorResponse(**parsed_dict)


# ─── API Helper Calls ─────────────────────────────────────────────────────────

async def _call_gemini(user_prompt: str) -> str:
    """Call Gemini API using the official SDK."""
    key = os.getenv("GEMINI_API_KEY") or os.getenv("gemini_api_key")
    if not key:
        raise ValueError("GEMINI_API_KEY is not set.")
    
    def _sync_call():
        genai.configure(api_key=key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(
            user_prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
            ),
        )
        return response.text.strip()

    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _sync_call)


async def _call_claude(user_prompt: str) -> str:
    """Call Claude API using httpx."""
    key = os.getenv("CLAUDE_API_KEY") or os.getenv("claude_api_key")
    if not key:
        raise ValueError("CLAUDE_API_KEY is not set.")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        payload = {
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 2048,
            "system": SYSTEM_PROMPT,
            "messages": [
                {"role": "user", "content": user_prompt}
            ]
        }
        response = await client.post("https://api.anthropic.com/v1/messages", json=payload, headers=headers)
        response.raise_for_status()
        res_json = response.json()
        return res_json["content"][0]["text"].strip()


async def _call_grok(user_prompt: str) -> str:
    """Call Grok (xAI) API using httpx (grok-4.3)."""
    key = os.getenv("GROK_API_KEY") or os.getenv("grok_api_key")
    if not key:
        raise ValueError("GROK_API_KEY is not set.")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "grok-4.3",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.2
        }
        response = await client.post("https://api.x.ai/v1/chat/completions", json=payload, headers=headers)
        response.raise_for_status()
        res_json = response.json()
        return res_json["choices"][0]["message"]["content"].strip()



# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/", response_model=AdvisorResponse)
async def get_property_advice(body: AdvisorRequest):
    """Get AI-powered construction & investment advice rotating between Gemini, Claude, and Grok."""
    features = body.features
    prediction = body.prediction

    # Build standard prompt
    try:
        shap_text = "\n".join(
            [f"- {f['feature']}: ₱{f['impact']:+,.0f}" for f in (prediction.top_features or [])]
        )
    except Exception:
        shap_text = "(SHAP data unavailable)"

    user_prompt = f"""
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

    errors = []

    # 1. Attempt Gemini
    try:
        logger.info("Attempting AI advice using Gemini...")
        response_text = await _call_gemini(user_prompt)
        parsed = _parse_json(response_text)
        logger.info("Successfully generated AI advice using Gemini.")
        return parsed
    except Exception as e:
        err_msg = f"Gemini failed: {type(e).__name__}: {e}"
        logger.warning(err_msg)
        errors.append(err_msg)

    # 2. Attempt Claude fallback
    try:
        logger.info("Attempting AI advice fallback to Claude...")
        response_text = await _call_claude(user_prompt)
        parsed = _parse_json(response_text)
        logger.info("Successfully generated AI advice using Claude.")
        return parsed
    except Exception as e:
        err_msg = f"Claude fallback failed: {type(e).__name__}: {e}"
        logger.warning(err_msg)
        errors.append(err_msg)

    # 3. Attempt Grok fallback
    try:
        logger.info("Attempting AI advice fallback to Grok...")
        response_text = await _call_grok(user_prompt)
        parsed = _parse_json(response_text)
        logger.info("Successfully generated AI advice using Grok.")
        return parsed
    except Exception as e:
        err_msg = f"Grok fallback failed: {type(e).__name__}: {e}"
        logger.warning(err_msg)
        errors.append(err_msg)

    # All providers failed
    error_summary = " | ".join(errors)
    logger.error(f"All AI Site Advisor models failed or hit limits: {error_summary}")
    raise HTTPException(
        status_code=503,
        detail=f"AI Site Advisor service is currently unavailable. All fallback options exhausted: {error_summary}"
    )


@router.get("/diagnose")
async def diagnose_advisor_apis(request: Request):
    """Diagnose the Gemini, Claude, and Grok API setups and connections."""
    secret = request.headers.get("X-Admin-Key")
    if secret != os.getenv("ADMIN_SECRET", ""):
        raise HTTPException(status_code=403, detail="Forbidden")

    results = {}

    # 1. Diagnose Gemini
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("gemini_api_key")
    if not gemini_key:
        results["gemini"] = {"status": "missing", "message": "GEMINI_API_KEY is not set."}
    else:
        try:
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-2.5-flash")
            response = model.generate_content("Say 'Gemini is online!'")
            results["gemini"] = {
                "status": "success",
                "message": "Connection check passed!",
                "masked_key": f"{gemini_key[:4]}...{gemini_key[-4:]}" if len(gemini_key) > 8 else "short",
                "response": response.text.strip()
            }
        except Exception as e:
            results["gemini"] = {"status": "failed", "error": str(e)}

    # 2. Diagnose Claude
    claude_key = os.getenv("CLAUDE_API_KEY") or os.getenv("claude_api_key")
    if not claude_key:
        results["claude"] = {"status": "missing", "message": "CLAUDE_API_KEY is not set."}
    else:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                headers = {
                    "x-api-key": claude_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                }
                payload = {
                    "model": "claude-3-5-sonnet-20241022",
                    "max_tokens": 10,
                    "messages": [{"role": "user", "content": "Say 'Claude is online!'"}]
                }
                response = await client.post("https://api.anthropic.com/v1/messages", json=payload, headers=headers)
                response.raise_for_status()
                res_json = response.json()
                results["claude"] = {
                    "status": "success",
                    "message": "Connection check passed!",
                    "masked_key": f"{claude_key[:4]}...{claude_key[-4:]}" if len(claude_key) > 8 else "short",
                    "response": res_json["content"][0]["text"].strip()
                }
        except Exception as e:
            results["claude"] = {"status": "failed", "error": str(e)}

    # 3. Diagnose Grok
    grok_key = os.getenv("GROK_API_KEY") or os.getenv("grok_api_key")
    if not grok_key:
        results["grok"] = {"status": "missing", "message": "GROK_API_KEY is not set."}
    else:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                headers = {
                    "Authorization": f"Bearer {grok_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "grok-4.3",
                    "messages": [{"role": "user", "content": "Say 'Grok is online!'"}],
                    "max_tokens": 10
                }
                response = await client.post("https://api.x.ai/v1/chat/completions", json=payload, headers=headers)
                response.raise_for_status()
                res_json = response.json()
                results["grok"] = {
                    "status": "success",
                    "message": "Connection check passed!",
                    "masked_key": f"{grok_key[:4]}...{grok_key[-4:]}" if len(grok_key) > 8 else "short",
                    "response": res_json["choices"][0]["message"]["content"].strip()
                }
        except Exception as e:
            results["grok"] = {"status": "failed", "error": str(e)}

    return results
