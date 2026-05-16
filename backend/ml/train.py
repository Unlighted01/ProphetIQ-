import pandas as pd
import numpy as np
import os
import joblib
import xgboost as xgb
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.metrics import mean_absolute_error, r2_score
import shap

def train_model():
    processed_dir = os.path.join("backend", "data", "processed")
    train_path = os.path.join(processed_dir, "train_clean.csv")
    
    if not os.path.exists(train_path):
        print(f"Error: {train_path} not found.")
        return
        
    df = pd.read_csv(train_path)
    
    # Separate features and target
    X = df.drop(columns=['SalePrice', 'Id'])
    y = df['SalePrice']
    
    # Identify categorical and numerical columns
    num_cols = X.select_dtypes(include=[np.number]).columns.tolist()
    cat_cols = X.select_dtypes(include=['object']).columns.tolist()
    
    # Preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_cols)
        ])
        
    # Model pipeline
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', xgb.XGBRegressor(n_estimators=1000, learning_rate=0.05, max_depth=4, random_state=42))
    ])
    
    # Train model
    print("Training XGBoost model...")
    model.fit(X, y)
    
    # Predict and evaluate
    y_pred = model.predict(X)
    mae = mean_absolute_error(y, y_pred)
    r2 = r2_score(y, y_pred)
    
    print(f"Training Complete.")
    print(f"Mean Absolute Error (MAE): ${mae:,.2f}")
    print(f"R-squared (R2): {r2:.4f}")
    
    # Save model
    model_path = os.path.join("backend", "ml", "model.pkl")
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")
    
    # Prepare explainer (using transformed features for tree explainer)
    print("Preparing SHAP explainer...")
    X_transformed = preprocessor.transform(X)
    # Using TreeExplainer for XGBoost model directly
    explainer = shap.TreeExplainer(model.named_steps['regressor'])
    
    explainer_path = os.path.join("backend", "ml", "explainer.pkl")
    joblib.dump(explainer, explainer_path)
    print(f"Explainer saved to {explainer_path}")

if __name__ == "__main__":
    train_model()
