import os
import joblib
import pandas as pd
from typing import Tuple

# Point to new PH model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml", "model_ph.pkl")
EXPLAINER_PATH = os.path.join(os.path.dirname(__file__), "..", "ml", "explainer_ph.pkl")

_model = None
_explainer = None

def load_artifacts():
    global _model, _explainer
    if _model is None:
        _model = joblib.load(MODEL_PATH)
        print("[OK] PH Model loaded.")
    if _explainer is None:
        _explainer = joblib.load(EXPLAINER_PATH)
        print("[OK] PH SHAP Explainer loaded.")

def is_model_loaded() -> bool:
    return _model is not None

def predict_price(features: dict) -> Tuple[float, list]:
    load_artifacts()
    
    # Create DataFrame with exact column names expected by the model
    # Note: 'Floor_area (sqm)' and 'Land_area (sqm)' are the keys
    df = pd.DataFrame([features])
    
    # Get prediction
    raw_price = float(_model.predict(df)[0])
    
    PANGASINAN_CITIES = [
        "Alaminos", "Dagupan", "San Carlos", "Urdaneta", "Agno", "Aguilar",
        "Alcala", "Anda", "Asingan", "Balungao", "Bani", "Basista", "Bautista",
        "Bayambang", "Binalonan", "Binmaley", "Bolinao", "Bugallon", "Burgos",
        "Calasiao", "Dasol", "Infanta", "Labrador", "Laoac", "Lingayen",
        "Mabini", "Malasiqui", "Manaoag", "Mangaldan", "Mangatarem", "Mapandan",
        "Natividad", "Pozorrubio", "Rosales", "San Fabian", "San Jacinto",
        "San Manuel", "San Nicolas", "San Quintin", "Santa Barbara", "Santa Maria",
        "Santo Tomas", "Sison", "Sual", "Tayug", "Umingan", "Urbiztondo", "Villasis"
    ]

    PANGASINAN_MULTIPLIER = 0.18

    city = features.get("City", "")
    if city in PANGASINAN_CITIES:
        raw_price = raw_price * PANGASINAN_MULTIPLIER
    
    # SHAP
    preprocessor = _model.named_steps['preprocessor']
    regressor = _model.named_steps['regressor']
    
    X_transformed = preprocessor.transform(df)
    shap_values = _explainer.shap_values(X_transformed)
    
    # Feature names
    num_features = preprocessor.transformers_[0][2]
    cat_encoder = preprocessor.transformers_[1][1]
    cat_features = cat_encoder.get_feature_names_out(preprocessor.transformers_[1][2]).tolist()
    all_features = list(num_features) + cat_features
    
    shap_vals = shap_values[0] if shap_values.ndim > 1 else shap_values
    feature_impacts = [
        {"feature": f, "impact": round(float(s), 2)}
        for f, s in zip(all_features, shap_vals)
    ]
    feature_impacts.sort(key=lambda x: abs(x["impact"]), reverse=True)
    
    return raw_price, feature_impacts[:10]
