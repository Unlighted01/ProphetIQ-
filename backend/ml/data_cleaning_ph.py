import pandas as pd
import numpy as np
import os

def clean_ph_data(input_path, output_path):
    print(f"Reading PH data from {input_path}...")
    df = pd.read_csv(input_path)

    # 1. Clean Price (PHP) - Remove commas and convert to float
    df = df[df['Price (PHP)'] != 'na']
    df['Price (PHP)'] = df['Price (PHP)'].str.replace(',', '').astype(float)

    # 2. Handle 'na' values in numeric columns
    numeric_cols = ['Bedrooms', 'Bath', 'Floor_area (sqm)', 'Land_area (sqm)', 'Latitude', 'Longitude']
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        # Fill with 0 or median? For area, 0 might mean it's a condo (no land area).
        # We'll fill with 0 and then handle it in features.
        df[col] = df[col].fillna(0)

    # 3. Handle Location - Extract City/Province
    # Location usually looks like "Ugong, Pasig" or "Mactan, Lapu-Lapu"
    df['City'] = df['Location'].str.split(',').str[-1].str.strip()

    # 4. Feature Engineering
    # Create a 'PropertyType' based on land area
    df['IsCondo'] = (df['Land_area (sqm)'] == 0).astype(int)
    
    # 5. Remove obvious outliers (e.g., Price = 0 or extremely high/low)
    df = df[df['Price (PHP)'] > 100000] # Minimal reasonable price
    df = df[df['Floor_area (sqm)'] > 5]  # Minimal reasonable area

    # 6. Final selection
    features = ['Price (PHP)', 'Bedrooms', 'Bath', 'Floor_area (sqm)', 'Land_area (sqm)', 'City', 'IsCondo', 'Latitude', 'Longitude']
    df_clean = df[features]

    print(f"Cleaned data has {len(df_clean)} rows.")
    df_clean.to_csv(output_path, index=False)
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    raw_path = "backend/data/raw/ph_houses.csv"
    processed_path = "backend/data/processed/ph_houses_clean.csv"
    
    if not os.path.exists("backend/data/processed"):
        os.makedirs("backend/data/processed")
        
    clean_ph_data(raw_path, processed_path)
