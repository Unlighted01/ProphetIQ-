<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 🤖 ProphetIQ — AI Agent Handoff Document

**Last Updated by:** Antigravity (Google DeepMind Advanced Agentic Coding AI)
**Project:** ProphetIQ — Philippines AI Real Estate Intelligence Platform
**Status:** Part 1 (Phases 1–8) COMPLETE. Part 2 (Polishing Phase) APPROVED but NOT YET STARTED.

---

## 🗂️ Project Architecture

```
ProphetIQ/
├── backend/                   # FastAPI Python backend
│   ├── .env                   # API keys (GEMINI_API_KEY, ANTHROPIC_API_KEY)
│   ├── main.py                # FastAPI app entrypoint, lifespan, CORS
│   ├── requirements.txt       # Python dependencies
│   ├── data/
│   │   └── raw/ph_houses.csv  # Philippine housing dataset
│   ├── ml/
│   │   ├── data_cleaning_ph.py # PH dataset cleaner
│   │   ├── train_ph.py        # XGBoost training script (run this to retrain)
│   │   ├── ph_model.pkl       # Active XGBoost model (PH-1.0.0) ⚠️ NOT in git
│   │   └── ph_explainer.pkl   # SHAP TreeExplainer ⚠️ NOT in git
│   ├── routers/
│   │   ├── predict.py         # POST /api/v1/predict/
│   │   ├── advisor.py         # POST /api/v1/advisor/ (Gemini AI)
│   │   └── investment.py      # POST /api/v1/investment/
│   ├── schemas/
│   │   └── property.py        # Pydantic models for all request/response
│   └── services/
│       └── predictor.py       # Loads model, runs SHAP, returns predictions
└── frontend/                  # Next.js 16 (App Router) frontend
    └── src/
        ├── app/
        │   ├── page.tsx       # Main page — ORCHESTRATES all components
        │   ├── layout.tsx     # Root layout with metadata
        │   └── globals.css    # Global styles + Tailwind base
        ├── components/
        │   ├── PredictionForm.tsx     # Property input form
        │   ├── PriceDisplay.tsx       # Animated price result
        │   ├── ShapChart.tsx          # SHAP bar chart (Recharts)
        │   ├── InvestmentDashboard.tsx # Financial metrics (mortgage, ROI)
        │   ├── MapView.tsx            # react-leaflet map with property pin
        │   └── AIAdvisorPanel.tsx     # Gemini AI analysis panel
        └── lib/
            └── api.ts         # All fetch calls to the backend
```

---

## ✅ What Has Been Completed (Part 1 — Phases 1–8)

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Project scaffolding (FastAPI + Next.js 16) | ✅ Done |
| 2 | XGBoost ML model trained on Philippine housing data | ✅ Done |
| 3 | Gemini AI Advisor (`/api/v1/advisor/`) | ✅ Done |
| 4 | SHAP feature importance chart | ✅ Done |
| 5 | Philippine Peso (₱) + sqm localization | ✅ Done |
| 6 | `AIAdvisorPanel.tsx` frontend component | ✅ Done |
| 7 | Interactive Leaflet map (`MapView.tsx`) | ✅ Done |
| 8 | Investment Dashboard (mortgage, yield, ROI) | ✅ Done |

---

## 🚧 What Needs to Be Done Next (Part 2 — Polishing Phase)

The user has APPROVED this plan. You must execute ALL of the following:

### Task 1: City Expansion & Auto-Mapping
- **File:** `frontend/src/components/PredictionForm.tsx`
- Expand `PH_CITIES` to 20-30 cities covering Metro Manila, Visayas, Mindanao.
- Create a `CITY_COORDS` dictionary mapping city name → `{ lat, lng }`.
- When user selects a city, auto-update `Latitude` and `Longitude` in form state so the Leaflet map pin instantly moves to the correct location.

### Task 2: Recommended Properties Component
- **File:** `frontend/src/components/RecommendedProperties.tsx` ← CREATE THIS
- Show 3 dynamically-generated comparable listings based on the predicted price ±10%.
- Include: property image (Unsplash URL), title, price badge, bedroom/bath badges, city label.
- Premium glassmorphism card design consistent with existing UI.
- Render this in `page.tsx` below the `MapView`.

### Task 3: Contact / Expert Advisor Section
- **File:** `frontend/src/components/ContactSection.tsx` ← CREATE THIS
- "Speak to a Local Expert" section with 3 mock agent cards (name, specialty, image).
- Each card has phone icon + "Schedule Consultation" button.
- Place this ABOVE the footer in `page.tsx`.

### Task 4: ML Logic Enhancements
- **File:** `backend/ml/train_ph.py`
- Add `RandomizedSearchCV` hyperparameter tuning for XGBoost.
- Add K-Fold cross-validation (cv=5) to validate model robustness.
- Print best params and CV R² score.
- Re-serialize `ph_model.pkl` and `ph_explainer.pkl` after training.

### Task 5: UI & UX Polish
- Enhance staggered fade-in animations across components.
- Add hover glow effects to result cards.
- Make the overall results section feel like a premium financial report.

---

## 🔑 Key Technical Decisions & Gotchas

1. **Model artifacts are NOT in git.** To get the model running, you must run:
   ```bash
   cd ProphetIQ
   .\venv\Scripts\python.exe backend/ml/train_ph.py
   ```
   This generates `backend/ml/ph_model.pkl` and `backend/ml/ph_explainer.pkl`.

2. **Gemini API uses the `google-generativeai` SDK** (not `google-genai`). The `advisor.py` router tries `gemini-1.5-flash` first, then falls back to `gemini-pro` if the model is not available in the user's region.

3. **MapView uses dynamic import** in `page.tsx` to prevent SSR crashes:
   ```tsx
   const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });
   ```

4. **`__init__.py` files in `backend/routers/`, `backend/schemas/`, `backend/services/`** are intentionally empty — required for Python package resolution.

5. **All currency is Philippine Peso (₱)** and area is in **sqm**. Do NOT use USD or sq ft anywhere.

6. **Backend runs on:** `http://localhost:8000` | **Frontend runs on:** `http://localhost:3000`
   - Start backend: `.\venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000`
   - Start frontend: `cd frontend && npm run dev`

7. **CORS** is configured in `backend/main.py` for `http://localhost:3000`.

8. **Pydantic schemas use aliases** — `PropertyFeatures` uses `Field(alias="Floor_area (sqm)")` etc. When calling `model_dump()`, use `by_alias=True`.

---

## 🎨 Design System

The frontend uses **Tailwind CSS v3** with a custom dark theme. Key classes:
- `glass` — glassmorphism card background
- `text-gradient` — blue-purple gradient text
- `bg-grad-hero` — button gradient
- `animate-fade-in` — opacity fade-in animation
- Colors: `text-accent` (green), `text-danger` (red), `text-text-secondary`, `bg-bg-deep`

---

*This file is maintained by the AI agents working on ProphetIQ. Please update it after completing each task so the next agent knows exactly where you left off.*

---

## 🗺️ FULL ROADMAP — Part 2 & Beyond

> **Instructions for incoming AI agents:**
> Part 1 (Phases 1–8) is 100% complete. The user has approved Part 2. Work through each task **in order**. After completing all Part 2 tasks, commit to GitHub and update the status table below.

---

### PART 2 — Polishing Phase ⬅️ COMPLETE

**Overall goal:** Transform the functional MVP into a fully immersive, premium Philippine real estate platform.

| Task | Description | Priority | Status |
|------|-------------|----------|--------|
| 2.1 | City Expansion & Auto-Mapping | 🔴 High | ✅ Complete |
| 2.2 | Recommended Properties Component | 🔴 High | ✅ Complete |
| 2.3 | Contact / Expert Advisor Section | 🟡 Medium | ✅ Complete |
| 2.4 | ML Hyperparameter Tuning + K-Fold CV | 🔴 High | ✅ Complete |
| 2.5 | UI/UX Polish & Staggered Animations | 🟡 Medium | ✅ Complete |

---

## 📋 Agent Changelog

| Date | Agent | Action |
|------|-------|--------|
| 2026-05-15 | Antigravity (Google DeepMind) | Initial project build — Phases 1–8, PH localization, ML training, all core components |
| 2026-05-16 | Antigravity (Google DeepMind) | Switched AI provider to Gemini, added Investment Dashboard, Leaflet Map, fixed form UX, wrote this handoff doc |
| 2026-05-16 | Antigravity (Google DeepMind) | Completed Part 2 (Polishing): 38-city expansion, auto-mapping, Recommended Properties, Contact Section, and 0.976 R² ML optimization. |

---

#### Task 2.1 — City Expansion & Auto-Mapping
**Files:** `frontend/src/components/PredictionForm.tsx`

Expand `PH_CITIES` array to include ~25-30 cities across all major Philippine regions:
- Metro Manila: Manila, Makati, Taguig, Pasig, Quezon City, Mandaluyong, Pasay, Parañaque, Marikina, Caloocan
- Luzon: Baguio, Angeles, San Fernando (Pampanga), Cabanatuan, Lipa, Batangas, Lucena, Legazpi
- Visayas: Cebu, Lapu-Lapu, Mandaue, Iloilo, Bacolod, Tacloban, Dumaguete
- Mindanao: Davao, General Santos, Cagayan de Oro, Zamboanga, Cotabato

Create a `CITY_COORDS` dictionary:
```ts
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "Makati": { lat: 14.5547, lng: 121.0244 },
  "Taguig": { lat: 14.5176, lng: 121.0509 },
  "Baguio": { lat: 16.4023, lng: 120.5960 },
  "Cebu": { lat: 10.3157, lng: 123.8854 },
  "Davao": { lat: 7.1907, lng: 125.4553 },
  // ... all cities
};
```

When the user changes the City dropdown, call `setFormData` to update `Latitude` and `Longitude` automatically.

---

#### Task 2.2 — Recommended Properties Component
**File to CREATE:** `frontend/src/components/RecommendedProperties.tsx`
**Integrate in:** `frontend/src/app/page.tsx` (below `MapView`)

Props: `{ city: string, predictedPrice: number, bedrooms: number, isCondo: number }`

Generate 3 comparable properties with this logic:
- Vary price ±5–15% from predicted price
- Use Unsplash photo URLs for high-quality images (e.g., `https://images.unsplash.com/photo-XXXXX?w=400&q=80`)
- Show: image, property title, city tag, price badge, beds/baths/sqm details
- Premium glassmorphism card design with hover lift effect (`hover:-translate-y-1 transition-all`)
- Only render after a prediction is made

Property title templates: `"Modern ${isCondo ? 'Condo' : 'House'} in ${city}"`, `"Luxury ${type} near ${city} CBD"`, etc.

---

#### Task 2.3 — Contact / Expert Advisor Section
**File to CREATE:** `frontend/src/components/ContactSection.tsx`
**Integrate in:** `frontend/src/app/page.tsx` (above `<footer>`, always visible)

Build a "Speak to a Local Expert" section:
- Section header: "Connect with a Philippine Real Estate Expert"
- 3 mock agent cards with:
  - Avatar (use `https://i.pravatar.cc/80?img=X` for realistic avatars)
  - Name (Filipino names: e.g., "Maria Santos", "Jose dela Cruz", "Ana Reyes")
  - Specialty (e.g., "Metro Manila Condos", "Cebu & Visayas Properties", "Commercial & Investment")
  - Rating badge (4.8★, 4.9★)
  - "Schedule Consultation" button with hover glow
- Full-width CTA at the bottom: "List Your Property on ProphetIQ" button

---

#### Task 2.4 — ML Hyperparameter Tuning
**File:** `backend/ml/train_ph.py`

Replace the current static XGBoost params with `RandomizedSearchCV`:
```python
from sklearn.model_selection import RandomizedSearchCV, KFold

param_distributions = {
    'n_estimators': [200, 400, 600, 800],
    'learning_rate': [0.01, 0.05, 0.1, 0.15],
    'max_depth': [3, 4, 5, 6, 7],
    'subsample': [0.7, 0.8, 0.9, 1.0],
    'colsample_bytree': [0.7, 0.8, 0.9, 1.0],
    'min_child_weight': [1, 3, 5],
}

cv = KFold(n_splits=5, shuffle=True, random_state=42)
search = RandomizedSearchCV(
    xgb.XGBRegressor(random_state=42),
    param_distributions,
    n_iter=30,
    scoring='r2',
    cv=cv,
    n_jobs=-1,
    verbose=1
)
search.fit(X_train, y_train)
best_model = search.best_estimator_
```
After fitting, print `search.best_params_` and cross-val R² score. Re-serialize both `ph_model.pkl` and `ph_explainer.pkl`.

---

#### Task 2.5 — UI/UX Polish
**Files:** `frontend/src/app/globals.css`, `frontend/src/app/page.tsx`, all component files

- Add staggered animation delays to results components (use `animation-delay: 100ms`, `200ms`, etc.)
- Add `hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all` to all result cards
- Improve the results section layout — make it feel like a scrollable financial intelligence report
- Add a subtle divider/section label (e.g., `ML ANALYSIS`, `LOCATION`, `INVESTMENT`) between each panel

---

### PART 3 — Future Vision (Not Yet Scoped)

> These are stretch goals the user has not formally approved yet. Raise them after Part 2 is complete.

| Feature | Description |
|---------|-------------|
| **Live PH Listings API** | Integrate a Philippine property listing scraper or Lamudi/Dot Property API for real comps |
| **User Accounts** | Add Supabase auth so users can save searches and properties |
| **Vercel Deployment** | Deploy frontend to Vercel, backend to Railway or Render |
| **Price History Charts** | Show a 12-month price trend chart for each city using synthetic data |
| **Mobile App** | React Native version for iOS/Android |
| **Neighborhood Score** | Scrape or estimate walkability, flood risk, school zones for each location |

---

## 📋 Agent Changelog

| Date | Agent | Action |
|------|-------|--------|
| 2026-05-15 | Antigravity (Google DeepMind) | Initial project build — Phases 1–8, PH localization, ML training, all core components |
| 2026-05-16 | Antigravity (Google DeepMind) | Switched AI provider to Gemini, added Investment Dashboard, Leaflet Map, fixed form UX, wrote this handoff doc |
| 2026-05-16 | Antigravity (Google DeepMind) | Completed Part 2 (Polishing): 38-city expansion, auto-mapping, Recommended Properties, Contact Section, and 0.976 R² ML optimization. |
| 2026-05-18 | Antigravity (Google DeepMind) | Resolved Procfile/Nixpacks absolute PYTHONPATH conflicts and relative imports to fix backend container startup. |
| 2026-05-18 | Antigravity (Google DeepMind) | Hardened security: Locked down CORS to production Vercel/localhost, added Pydantic range validation, and configured Next.js security headers (HSTS, nosniff, DENY). |
| 2026-05-18 | Antigravity (Google DeepMind) | Polished UX: Integrated glassmorphic Sonner toast alerts, confidence interval bar in PriceDisplay, parallelized API fetches, and card-based SHAP layout. |
| 2026-05-18 | Antigravity (Google DeepMind) | Fixed 500 error: Removed conflicting per-router SlowAPI Limiter instances in favor of global app state rate-limiting. |
| 2026-05-18 | Antigravity (Google DeepMind) | Upgraded AI Advisor: Discovered 404 model deprecation using programmatic list_models, upgraded Gemini to `gemini-2.5-flash`, and established dynamic API key resolution. |
| 2026-05-18 | Antigravity (Google DeepMind) | Finished UI Polish: Added sleek scrollbars with max-height to Advisor's Investment Take and Red Flags to maintain card symmetry. |
| 2026-05-18 | Antigravity (Google DeepMind) | Launched Phase 3 (Features): Implemented F1 Price Appreciation Area Chart and F10 Dynamic Bank Mortgage Partner Table under a stunning tabbed interface in InvestmentDashboard. |


