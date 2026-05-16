# ProphetIQ — AI-Powered Real Estate Intelligence Platform
## Full Implementation Plan

> A full-stack real estate platform that combines ML price prediction, interactive map intelligence,
> investment analysis, and a Claude-powered AI property advisor. Built with FastAPI + Next.js.
> Looks like a startup. Built by one person.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Feature Set](#2-feature-set)
3. [Architecture Overview](#3-architecture-overview)
4. [Tech Stack](#4-tech-stack)
5. [Data Pipeline](#5-data-pipeline)
6. [ML Model](#6-ml-model)
7. [FastAPI Backend](#7-fastapi-backend)
8. [Next.js Frontend](#8-nextjs-frontend)
9. [Claude AI Advisor Integration](#9-claude-ai-advisor-integration)
10. [Map Intelligence Layer](#10-map-intelligence-layer)
11. [Investment Analyzer](#11-investment-analyzer)
12. [File Structure](#12-file-structure)
13. [Environment Variables](#13-environment-variables)
14. [Build Phases](#14-build-phases)
15. [MVP Scope](#15-mvp-scope)

---

## 1. Project Overview

**Project name:** ProphetIQ  
**Tagline:** *Know what a home is really worth — and what to do about it.*  
**Stack:** Python (FastAPI) backend + Next.js 15 frontend  
**Data:** Kaggle House Prices dataset (ML training) + RapidAPI Zillow (live listings)  
**AI layer:** Claude API (claude-sonnet-4-20250514)  
**Deployment target:** Local development (can deploy to Vercel + Railway later)

### What makes this different from every other price predictor

| Standard predictor | ProphetIQ |
|---|---|
| Outputs one number | Outputs price + confidence range + explanation |
| No context | Claude explains WHY in plain English |
| Static form | Interactive map with price heatmaps |
| Just prediction | Full investment analysis: ROI, rental yield, flip score |
| No comparison | Shows similar listings from live Zillow data |
| Boring UI | Dashboard-quality interface with charts |

---

## 2. Feature Set

### Feature 1 — Price Predictor
- User inputs: bedrooms, bathrooms, sqft, lot size, zip code, year built, condition
- ML model returns: predicted price + confidence interval (low / mid / high estimate)
- Shows which features influenced the price most (SHAP values)

### Feature 2 — AI Property Advisor (Claude)
- Claude receives the prediction result + all input features
- Returns a plain-English breakdown:
  - Why the price is what it is
  - Whether it's a buyer's or seller's market for that zip
  - Red flags to watch out for (e.g. very old build year, small lot)
  - Personalized investment recommendation
- Conversational follow-up: user can ask Claude follow-up questions about the property

### Feature 3 — Map Intelligence
- Interactive map (Mapbox or Leaflet) centered on the searched zip code
- Price heatmap layer — color-coded by median price per sqft per neighborhood
- Marker pins for live Zillow listings nearby
- Click any pin to see listing details + run instant prediction on it

### Feature 4 — Investment Analyzer
Given the predicted price, calculate and display:
- **Buy & Hold ROI** — estimated annual appreciation + rental income vs mortgage cost
- **Rental Yield** — estimated monthly rent / purchase price × 100
- **Flip Score** — based on condition, year built, price vs neighborhood median
- **Mortgage Calculator** — monthly payment at 10%, 20%, 30% down at current rates
- **Break-even timeline** — how many years to recoup investment
- All shown as a clean dashboard with charts (Recharts)

### Feature 5 — Comparable Listings (Comps)
- Pulls 5–10 live Zillow listings in the same zip with similar specs
- Shows them in a comparison table: their price vs ProphetIQ's prediction
- Highlights if the target property is over/under market

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────┐
│              Next.js 15 Frontend             │
│  Price Form │ Map View │ Investment Dashboard│
│         AI Chat │ Comps Table               │
└──────────────────┬──────────────────────────┘
                   │ HTTP / REST
┌──────────────────▼──────────────────────────┐
│              FastAPI Backend                 │
│                                             │
│  /predict      → ML model inference         │
│  /advisor      → Claude API call            │
│  /map-data     → Zillow API + geo data      │
│  /investment   → Financial calculations     │
│  /comps        → Zillow comparable listings │
└──────┬──────────────┬───────────────────────┘
       │              │
┌──────▼──────┐  ┌────▼──────────────────────┐
│  ML Model   │  │   External APIs            │
│  (sklearn / │  │   - RapidAPI Zillow        │
│   XGBoost)  │  │   - Claude API             │
│  model.pkl  │  │   - Mapbox / OpenStreetMap │
└─────────────┘  └───────────────────────────┘
```

---

## 4. Tech Stack

### Backend (Python)
| Tool | Version | Purpose |
|---|---|---|
| FastAPI | latest | REST API framework |
| Uvicorn | latest | ASGI server |
| Pydantic v2 | latest | Request/response validation |
| scikit-learn | latest | ML pipeline, preprocessing |
| XGBoost | latest | Primary prediction model |
| SHAP | latest | Feature importance explanations |
| pandas | latest | Data manipulation |
| numpy | latest | Numerical ops |
| httpx | latest | Async HTTP calls to external APIs |
| anthropic | latest | Claude API SDK |
| python-dotenv | latest | Env var management |
| joblib | latest | Model serialization |

### Frontend (JavaScript/TypeScript)
| Tool | Version | Purpose |
|---|---|---|
| Next.js | 15 | React framework |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | v4 | Styling |
| shadcn/ui | latest | Component library |
| Recharts | latest | Investment charts |
| Leaflet + react-leaflet | latest | Interactive map |
| Zustand | latest | Client state |
| TanStack Query | latest | Server state / API calls |
| Framer Motion | latest | Animations |

---

## 5. Data Pipeline

### Step 1 — Download Kaggle dataset
Use the **House Prices: Advanced Regression Techniques** dataset from Kaggle.
- URL: https://www.kaggle.com/c/house-prices-advanced-regression-techniques
- Files needed: `train.csv`, `test.csv`
- Place in: `backend/data/raw/`

### Step 2 — Data cleaning (`backend/ml/data_cleaning.py`)

```python
# Key cleaning steps to implement:

# 1. Drop columns with >40% missing values
# 2. Fill numerical nulls with median
# 3. Fill categorical nulls with mode or 'None'
# 4. Encode categorical features (LabelEncoder for ordinals, OneHotEncoder for nominals)
# 5. Remove outliers: drop rows where SalePrice > 500000 and GrLivArea > 4000 (known outliers)
# 6. Log-transform SalePrice (target variable) to normalize distribution
# 7. Feature engineering:
#    - TotalSF = TotalBsmtSF + 1stFlrSF + 2ndFlrSF
#    - HouseAge = YrSold - YearBuilt
#    - Remodeled = 1 if YearRemodAdd != YearBuilt else 0
#    - TotalBathrooms = FullBath + 0.5 * HalfBath + BsmtFullBath + 0.5 * BsmtHalfBath
```

### Step 3 — Feature selection
Keep these core features for the user-facing prediction form (map to Kaggle columns):
| User input | Kaggle column |
|---|---|
| Bedrooms | BedroomAbvGr |
| Bathrooms | FullBath + HalfBath |
| Above-ground sqft | GrLivArea |
| Total sqft (engineered) | TotalSF |
| Lot size (sqft) | LotArea |
| Year built | YearBuilt |
| Garage capacity | GarageCars |
| Overall condition (1-10) | OverallCond |
| Overall quality (1-10) | OverallQual |
| Zip code | mapped to Neighborhood |

### Step 4 — Train/test split
```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

---

## 6. ML Model

### Model choice: XGBoost (primary) + Random Forest (ensemble)

XGBoost consistently wins on tabular regression tasks and is explainable via SHAP.

### Training script (`backend/ml/train.py`)

```python
import xgboost as xgb
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import shap
import joblib

# Pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', xgb.XGBRegressor(
        n_estimators=500,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    ))
])

pipeline.fit(X_train, y_train)

# Evaluate
from sklearn.metrics import mean_absolute_error, r2_score
y_pred = pipeline.predict(X_test)
print(f"MAE: ${mean_absolute_error(np.expm1(y_test), np.expm1(y_pred)):,.0f}")
print(f"R2: {r2_score(y_test, y_pred):.4f}")

# Save model
joblib.dump(pipeline, 'backend/ml/model.pkl')

# SHAP explainer
explainer = shap.TreeExplainer(pipeline.named_steps['model'])
joblib.dump(explainer, 'backend/ml/explainer.pkl')
```

### Confidence interval
Generate low/mid/high estimates:
```python
# Use quantile regression or simple heuristic:
mid = model.predict(X)
low = mid * 0.92   # -8%
high = mid * 1.08  # +8%
# For production: train separate quantile regressors at 10th and 90th percentile
```

### Expected model performance target
- MAE under $20,000
- R² above 0.88

---

## 7. FastAPI Backend

### Entry point: `backend/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict, advisor, map_data, investment, comps

app = FastAPI(title="ProphetIQ API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/predict")
app.include_router(advisor.router, prefix="/advisor")
app.include_router(map_data.router, prefix="/map")
app.include_router(investment.router, prefix="/investment")
app.include_router(comps.router, prefix="/comps")
```

### Endpoint: `POST /predict`

**Request body:**
```json
{
  "bedrooms": 3,
  "bathrooms": 2,
  "sqft_living": 1500,
  "sqft_lot": 6000,
  "year_built": 1995,
  "overall_quality": 7,
  "overall_condition": 5,
  "garage_cars": 2,
  "zip_code": "52401"
}
```

**Response:**
```json
{
  "predicted_price": 245000,
  "price_low": 225400,
  "price_high": 264600,
  "confidence": "high",
  "shap_features": [
    {"feature": "overall_quality", "impact": 28500, "direction": "positive"},
    {"feature": "sqft_living", "impact": 22000, "direction": "positive"},
    {"feature": "year_built", "impact": -8000, "direction": "negative"}
  ],
  "price_per_sqft": 163
}
```

### Endpoint: `POST /advisor`

**Request body:** Full prediction result + property inputs  
**Response:**
```json
{
  "summary": "This 3-bed home in zip 52401 is priced fairly...",
  "why_this_price": "...",
  "investment_take": "...",
  "red_flags": ["..."],
  "recommendation": "BUY | HOLD | AVOID",
  "follow_up_session_id": "uuid"
}
```

### Endpoint: `GET /map/heatmap?zip={zip}`
Returns GeoJSON with median price per sqft per neighborhood polygon for map rendering.

### Endpoint: `POST /investment`
Returns ROI, rental yield, flip score, mortgage breakdown.

### Endpoint: `GET /comps?zip={zip}&beds={n}&baths={n}&sqft={n}`
Returns 5–10 comparable Zillow listings.

---

## 8. Next.js Frontend

### Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, how it works, CTA |
| `/analyze` | Main tool — property input form |
| `/results/[id]` | Results page — prediction + all 4 features |
| `/map` | Full-screen map intelligence view |

### Key components

**`PropertyForm.tsx`**
- Input fields: bedrooms, bathrooms, sqft, lot size, year built, quality slider (1-10), condition slider, zip code
- Submit triggers `/predict` API call
- Loading state with animated skeleton

**`PredictionCard.tsx`**
- Shows predicted price as large headline
- Low / mid / high range as a visual bar
- Animated number count-up on load

**`ShapChart.tsx`**
- Horizontal bar chart (Recharts) showing top 5 feature impacts
- Green bars = pushed price up, red bars = pushed price down
- Tooltip explains each feature in plain English

**`AIAdvisorPanel.tsx`**
- Shows Claude's written analysis in sections: Summary, Why This Price, Red Flags, Recommendation
- Recommendation badge: BUY (green) / HOLD (yellow) / AVOID (red)
- Follow-up chat input — user can ask Claude follow-up questions about the property

**`MapView.tsx`**
- Leaflet map centered on searched zip
- Choropleth heatmap layer (price per sqft) with legend
- Zillow listing markers with popup cards
- Click listing → instantly run prediction on it

**`InvestmentDashboard.tsx`**
- 4 metric cards: ROI %, Rental Yield %, Flip Score, Monthly Mortgage
- Break-even timeline chart (line chart, years on x-axis, cumulative return on y-axis)
- Mortgage scenario table: 10% / 20% / 30% down payment comparison

**`CompsTable.tsx`**
- Table of 5–10 comparable Zillow listings
- Columns: address, beds, baths, sqft, list price, ProphetIQ estimate, delta (over/under)
- Delta column color-coded: green = under market, red = over market

---

## 9. Claude AI Advisor Integration

### System prompt

```
You are ProphetIQ's AI real estate advisor — a sharp, data-savvy property analyst who explains 
complex real estate valuations in clear, direct language for everyday buyers and investors.

You receive structured data about a property: its features, the ML model's predicted price, 
the confidence interval, and the top SHAP feature impacts (what drove the price).

Your job is to translate this into actionable insights. Be specific — reference the actual 
numbers. Be honest about risks. Don't be vague. Avoid generic real estate clichés.

Always structure your response as JSON with these exact keys:
- summary: 2-3 sentence plain-English overview
- why_this_price: explanation of the top 3 price drivers from SHAP data
- red_flags: array of strings, each a specific concern (empty array if none)
- investment_take: 2-3 sentences on investment potential
- recommendation: exactly one of "BUY", "HOLD", or "AVOID"
- recommendation_reason: one sentence explaining the recommendation
```

### User prompt template (`backend/routers/advisor.py`)

```python
def build_advisor_prompt(property_data: dict, prediction: dict) -> str:
    return f"""
Analyze this property for a potential buyer:

PROPERTY DETAILS:
- Bedrooms: {property_data['bedrooms']}
- Bathrooms: {property_data['bathrooms']}
- Living area: {property_data['sqft_living']:,} sqft
- Lot size: {property_data['sqft_lot']:,} sqft
- Year built: {property_data['year_built']}
- Overall quality score: {property_data['overall_quality']}/10
- Overall condition score: {property_data['overall_condition']}/10
- Zip code: {property_data['zip_code']}

ML PREDICTION RESULTS:
- Predicted price: ${prediction['predicted_price']:,}
- Low estimate: ${prediction['price_low']:,}
- High estimate: ${prediction['price_high']:,}
- Price per sqft: ${prediction['price_per_sqft']}
- Confidence: {prediction['confidence']}

TOP PRICE DRIVERS (SHAP analysis):
{chr(10).join([f"- {f['feature']}: ${f['impact']:+,} ({f['direction']})" 
               for f in prediction['shap_features']])}

Provide your analysis as the JSON structure specified.
"""
```

### Follow-up chat

- Store conversation history in Zustand on the frontend
- Each follow-up sends full history + property context back to `/advisor/chat`
- Backend appends to the message array and calls Claude with full context
- Max 10 follow-up turns per session

---

## 10. Map Intelligence Layer

### Data sources
- **Neighborhood polygons:** GeoJSON from OpenDataSoft or local government open data for US zip codes
- **Price heatmap data:** Aggregated from training dataset — median price per sqft grouped by neighborhood/zip
- **Live listings:** RapidAPI Zillow endpoint — `GET /search` by zip code

### Heatmap implementation

```python
# backend/routers/map_data.py
# Precompute at startup: median price_per_sqft per zip code from training data
# Store as dict: {"52401": 145, "52402": 162, ...}
# Serve as GeoJSON FeatureCollection with price_per_sqft as a property
# Frontend uses Leaflet choropleth to color polygons
```

### Color scale for heatmap
- Under $100/sqft → light blue
- $100–150/sqft → green
- $150–200/sqft → yellow
- $200–250/sqft → orange
- Over $250/sqft → red

### Live listing markers
```python
# backend/routers/map_data.py
import httpx

async def get_zillow_listings(zip_code: str, beds: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch",
            params={"location": zip_code, "beds_min": beds},
            headers={
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com"
            }
        )
    return response.json()
```

---

## 11. Investment Analyzer

### Calculations (`backend/routers/investment.py`)

```python
def calculate_investment_metrics(
    predicted_price: float,
    zip_code: str,
    down_payment_pct: float = 0.20,
    mortgage_rate: float = 0.07,  # fetch live rate from API or use configurable default
    mortgage_years: int = 30,
    annual_appreciation: float = 0.04,  # US historical average
) -> dict:

    # Mortgage calculation
    loan_amount = predicted_price * (1 - down_payment_pct)
    monthly_rate = mortgage_rate / 12
    n_payments = mortgage_years * 12
    monthly_payment = loan_amount * (monthly_rate * (1 + monthly_rate)**n_payments) / \
                      ((1 + monthly_rate)**n_payments - 1)

    # Rental yield estimate
    # Rule of thumb: monthly rent ≈ 0.8% of home value (varies by market)
    estimated_monthly_rent = predicted_price * 0.008
    annual_rental_income = estimated_monthly_rent * 12
    gross_rental_yield = (annual_rental_income / predicted_price) * 100

    # Cash flow
    annual_mortgage_cost = monthly_payment * 12
    annual_cash_flow = annual_rental_income - annual_mortgage_cost

    # ROI (5-year hold)
    future_value_5yr = predicted_price * (1 + annual_appreciation) ** 5
    equity_gained = future_value_5yr - predicted_price
    total_return_5yr = equity_gained + (annual_cash_flow * 5)
    roi_5yr = (total_return_5yr / (predicted_price * down_payment_pct)) * 100

    # Flip score (0-100)
    # Higher score = better flip candidate
    # Factors: low condition score (room to improve), older build year, price below neighborhood median
    flip_score = calculate_flip_score(...)

    # Break-even year
    break_even_year = calculate_break_even(...)

    return {
        "monthly_payment": round(monthly_payment),
        "estimated_monthly_rent": round(estimated_monthly_rent),
        "gross_rental_yield": round(gross_rental_yield, 2),
        "annual_cash_flow": round(annual_cash_flow),
        "roi_5yr": round(roi_5yr, 1),
        "flip_score": flip_score,
        "break_even_year": break_even_year,
        "mortgage_scenarios": [
            calculate_scenario(predicted_price, 0.10, mortgage_rate),
            calculate_scenario(predicted_price, 0.20, mortgage_rate),
            calculate_scenario(predicted_price, 0.30, mortgage_rate),
        ]
    }
```

---

## 12. File Structure

```
prophetiq/
├── backend/
│   ├── main.py
│   ├── routers/
│   │   ├── predict.py
│   │   ├── advisor.py
│   │   ├── map_data.py
│   │   ├── investment.py
│   │   └── comps.py
│   ├── ml/
│   │   ├── train.py               # Run once to train and save model
│   │   ├── data_cleaning.py       # Cleaning + feature engineering
│   │   ├── predict.py             # Inference helpers
│   │   ├── model.pkl              # Saved trained model (gitignored)
│   │   └── explainer.pkl          # Saved SHAP explainer (gitignored)
│   ├── data/
│   │   ├── raw/
│   │   │   ├── train.csv          # Kaggle dataset (gitignored)
│   │   │   └── test.csv
│   │   └── processed/
│   │       └── cleaned.csv
│   ├── services/
│   │   ├── zillow.py              # RapidAPI Zillow wrapper
│   │   └── claude.py              # Claude API wrapper
│   ├── schemas/
│   │   ├── property.py            # Pydantic models
│   │   └── responses.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Landing page
│   │   ├── analyze/
│   │   │   └── page.tsx           # Property input form
│   │   ├── results/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Full results dashboard
│   │   └── map/
│   │       └── page.tsx           # Full-screen map view
│   ├── components/
│   │   ├── PropertyForm.tsx
│   │   ├── PredictionCard.tsx
│   │   ├── ShapChart.tsx
│   │   ├── AIAdvisorPanel.tsx
│   │   ├── MapView.tsx
│   │   ├── InvestmentDashboard.tsx
│   │   └── CompsTable.tsx
│   ├── lib/
│   │   ├── api.ts                 # API call helpers
│   │   └── store.ts               # Zustand store
│   ├── hooks/
│   │   └── usePrediction.ts
│   ├── package.json
│   └── .env.local
│
└── README.md
```

---

## 13. Environment Variables

### Backend (`backend/.env`)
```env
ANTHROPIC_API_KEY=your_claude_api_key
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_ZILLOW_HOST=zillow-com1.p.rapidapi.com
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token  # or use Leaflet with free OSM tiles
```

---

## 14. Build Phases

### Phase 1 — Data + ML (Python only, no web yet)
- [ ] Download Kaggle House Prices dataset
- [ ] Build `data_cleaning.py` — clean, engineer features, save `cleaned.csv`
- [ ] Build `train.py` — train XGBoost model, evaluate, save `model.pkl`
- [ ] Build SHAP explainer, save `explainer.pkl`
- [ ] Write `predict.py` helper — load model, accept input dict, return prediction + SHAP values
- [ ] Target: MAE < $20,000, R² > 0.88

### Phase 2 — FastAPI Backend
- [ ] FastAPI project setup with Uvicorn
- [ ] Pydantic schemas for property input and prediction response
- [ ] `POST /predict` endpoint — load model, run inference, return prediction + SHAP
- [ ] `POST /investment` endpoint — financial calculations (no external API needed)
- [ ] Test both endpoints with curl or Postman

### Phase 3 — Claude Advisor
- [ ] `POST /advisor` endpoint — build prompt, call Claude API, parse JSON response
- [ ] `POST /advisor/chat` endpoint — follow-up conversation handler with history
- [ ] Test with sample property data

### Phase 4 — Zillow Integration
- [ ] Sign up for RapidAPI, subscribe to Zillow API (free tier)
- [ ] Build `zillow.py` service wrapper
- [ ] `GET /comps` endpoint — fetch comparable listings by zip + specs
- [ ] `GET /map/listings` endpoint — fetch listing pins for map view

### Phase 5 — Next.js Frontend Core
- [ ] Next.js 15 setup with TypeScript + Tailwind v4 + shadcn/ui
- [ ] Landing page with hero section
- [ ] `PropertyForm.tsx` — all inputs, validation, API call
- [ ] `PredictionCard.tsx` — price display with low/mid/high range
- [ ] `ShapChart.tsx` — horizontal bar chart with Recharts
- [ ] Results page layout

### Phase 6 — AI Advisor UI
- [ ] `AIAdvisorPanel.tsx` — display Claude's sections
- [ ] Recommendation badge component (BUY / HOLD / AVOID)
- [ ] Follow-up chat input + message history display
- [ ] Streaming response from Claude (optional enhancement)

### Phase 7 — Map Intelligence
- [ ] Leaflet map setup in Next.js (`react-leaflet`)
- [ ] Zip code centering on search
- [ ] Choropleth heatmap layer from `/map/heatmap` GeoJSON
- [ ] Zillow listing marker pins
- [ ] Click-to-predict on listing pin popup

### Phase 8 — Investment Dashboard
- [ ] `InvestmentDashboard.tsx` — 4 metric cards
- [ ] Break-even chart (Recharts LineChart)
- [ ] Mortgage scenario table (3 down payment options)
- [ ] `CompsTable.tsx` — comparison table with delta column

### Phase 9 — Polish
- [ ] Loading skeletons for all async sections
- [ ] Error states with helpful messages
- [ ] Mobile responsive layout
- [ ] README with demo GIF and architecture diagram
- [ ] Deploy: Railway (FastAPI) + Vercel (Next.js)

---

## 15. MVP Scope

For a working demo that impresses, build Phases 1–6 first. That gives you:

✅ Working ML prediction with confidence range  
✅ SHAP feature importance chart  
✅ Claude AI advisor with BUY/HOLD/AVOID recommendation  
✅ Follow-up chat about the property  
✅ Investment metrics dashboard  

Phases 7–8 (map + comps) are the cherry on top — add them after the core loop works.

**Demo script for portfolio/interviews:**
1. Enter a property (3 bed, 2 bath, 1500 sqft, 1990, quality 7, zip 52401)
2. Show the predicted price with confidence range
3. Show the SHAP chart — "this is what actually drove the price"
4. Show Claude's analysis — "this is what an AI advisor says about it"
5. Ask Claude a follow-up: "Is this a good rental property?"
6. Show the investment dashboard — ROI, rental yield, mortgage scenarios
7. Switch to map view — show price heatmap and nearby listings

That demo flow takes 3 minutes and covers ML, AI, financial analysis, and mapping. Nobody forgets it.

---

*Built with Python, FastAPI, Next.js, XGBoost, SHAP, and Claude. Looks like a startup. Built by one person.*
