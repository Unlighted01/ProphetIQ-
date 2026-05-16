import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import shap

def train_ph_model(data_path, model_path, explainer_path):
    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)

    # Features and Target
    X = df.drop(columns=['Price (PHP)'])
    y = df['Price (PHP)']

    # Identify columns
    num_cols = ['Bedrooms', 'Bath', 'Floor_area (sqm)', 'Land_area (sqm)', 'IsCondo', 'Latitude', 'Longitude']
    cat_cols = ['City']

    # Preprocessing
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore'), cat_cols)
        ]
    )

    # Pipeline
    model = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', XGBRegressor(
            n_estimators=1000,
            learning_rate=0.05,
            max_depth=7,
            random_state=42
        ))
    ])

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training model...")
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"Mean Absolute Error: PHP {mae:,.2f}")
    print(f"R2 Score: {r2:.4f}")

    # Save artifacts
    print(f"Saving model to {model_path}...")
    joblib.dump(model, model_path)

    # Prepare SHAP
    print("Preparing SHAP explainer...")
    # SHAP needs the transformed data
    X_transformed = preprocessor.transform(X_train)
    explainer = shap.TreeExplainer(model.named_steps['regressor'])
    joblib.dump(explainer, explainer_path)
    print("All artifacts saved.")

if __name__ == "__main__":
    data_path = "backend/data/processed/ph_houses_clean.csv"
    model_path = "backend/ml/model_ph.pkl"
    explainer_path = "backend/ml/explainer_ph.pkl"
    
    train_ph_model(data_path, model_path, explainer_path)
