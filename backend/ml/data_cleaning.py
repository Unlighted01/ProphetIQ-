import pandas as pd
import numpy as np
import os

def clean_and_engineer_features(df, is_train=True):
    """
    Applies feature engineering and basic cleaning.
    """
    df_clean = df.copy()
    
    # 1. Drop columns with too many missing values (e.g. PoolQC, MiscFeature, Alley, Fence, FireplaceQu)
    cols_to_drop = ["PoolQC", "MiscFeature", "Alley", "Fence", "FireplaceQu"]
    df_clean = df_clean.drop(columns=[col for col in cols_to_drop if col in df_clean.columns])
    
    # 2. Fill numerical missing values with median
    num_cols = df_clean.select_dtypes(include=[np.number]).columns
    for col in num_cols:
        if df_clean[col].isnull().any():
            df_clean[col] = df_clean[col].fillna(df_clean[col].median())
            
    # 3. Fill categorical missing values with 'None'
    cat_cols = df_clean.select_dtypes(include=['object']).columns
    for col in cat_cols:
        if df_clean[col].isnull().any():
            df_clean[col] = df_clean[col].fillna("None")

    # 4. Feature Engineering
    # Total square footage
    if 'TotalBsmtSF' in df_clean.columns and '1stFlrSF' in df_clean.columns and '2ndFlrSF' in df_clean.columns:
        df_clean['TotalSF'] = df_clean['TotalBsmtSF'] + df_clean['1stFlrSF'] + df_clean['2ndFlrSF']
        
    # Total bathrooms
    if all(c in df_clean.columns for c in ['FullBath', 'HalfBath', 'BsmtFullBath', 'BsmtHalfBath']):
        df_clean['TotalBath'] = df_clean['FullBath'] + (0.5 * df_clean['HalfBath']) + df_clean['BsmtFullBath'] + (0.5 * df_clean['BsmtHalfBath'])
        
    # House age
    if 'YearBuilt' in df_clean.columns and 'YrSold' in df_clean.columns:
        df_clean['HouseAge'] = df_clean['YrSold'] - df_clean['YearBuilt']
        
    if is_train and 'SalePrice' in df_clean.columns:
        # Outlier removal based on GrLivArea (as recommended by dataset author)
        df_clean = df_clean[df_clean['GrLivArea'] < 4000]
        
    return df_clean

if __name__ == "__main__":
    raw_dir = os.path.join("backend", "data", "raw")
    processed_dir = os.path.join("backend", "data", "processed")
    os.makedirs(processed_dir, exist_ok=True)
    
    train_path = os.path.join(raw_dir, "train.csv")
    if os.path.exists(train_path):
        train_df = pd.read_csv(train_path)
        train_clean = clean_and_engineer_features(train_df, is_train=True)
        train_clean.to_csv(os.path.join(processed_dir, "train_clean.csv"), index=False)
        print("Cleaned train data saved.")
    else:
        print("train.csv not found in raw data.")
        
    test_path = os.path.join(raw_dir, "test.csv")
    if os.path.exists(test_path):
        test_df = pd.read_csv(test_path)
        test_clean = clean_and_engineer_features(test_df, is_train=False)
        test_clean.to_csv(os.path.join(processed_dir, "test_clean.csv"), index=False)
        print("Cleaned test data saved.")
