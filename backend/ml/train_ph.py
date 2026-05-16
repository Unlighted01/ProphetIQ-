import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split, RandomizedSearchCV, KFold
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

    # Pre-transform data for RandomizedSearch (to keep the search fast)
    X_processed = preprocessor.fit_transform(X)

    # Hyperparameter Distributions
    param_dist = {
        'n_estimators': [200, 500, 800, 1200],
        'learning_rate': [0.01, 0.05, 0.1, 0.2],
        'max_depth': [3, 5, 7, 9],
        'subsample': [0.7, 0.8, 1.0],
        'colsample_bytree': [0.7, 0.8, 1.0],
        'gamma': [0, 0.1, 0.2]
    }

    print("Initiating Hyperparameter Tuning (RandomizedSearchCV)...")
    cv = KFold(n_splits=5, shuffle=True, random_state=42)
    random_search = RandomizedSearchCV(
        XGBRegressor(random_state=42, tree_method='auto'),
        param_distributions=param_dist,
        n_iter=20,
        cv=cv,
        scoring='r2',
        n_jobs=-1,
        verbose=1,
        random_state=42
    )
    
    random_search.fit(X_processed, y)
    
    print(f"Best Parameters: {random_search.best_params_}")
    print(f"Best CV R2 Score: {random_search.best_score_:.4f}")

    # Create final pipeline with best estimator
    final_model = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', random_search.best_estimator_)
    ])

    # Final split for hold-out evaluation
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    final_model.fit(X_train, y_train)

    # Evaluate
    y_pred = final_model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"\nHold-out Evaluation:")
    print(f"Mean Absolute Error: PHP {mae:,.2f}")
    print(f"R2 Score: {r2:.4f}")

    # Save artifacts
    print(f"\nSaving model to {model_path}...")
    joblib.dump(final_model, model_path)

    # Prepare SHAP
    print("Preparing SHAP explainer...")
    explainer = shap.TreeExplainer(final_model.named_steps['regressor'])
    joblib.dump(explainer, explainer_path)
    print("All artifacts saved.")

if __name__ == "__main__":
    data_path = "backend/data/processed/ph_houses_clean.csv"
    model_path = "backend/ml/model_ph.pkl"
    explainer_path = "backend/ml/explainer_ph.pkl"
    
    train_ph_model(data_path, model_path, explainer_path)
