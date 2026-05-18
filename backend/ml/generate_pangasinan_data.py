import pandas as pd
import numpy as np
import random
import os

def generate_pangasinan_listings(count=250):
    # Pangasinan Cities and Municipalities coordinates from frontend
    pangasinan_locations = {
        "Alaminos":    {"lat": 16.1517, "lng": 119.9806, "areas": ["Poblacion", "Lucap", "Alos", "Bani"]},
        "Dagupan":     {"lat": 16.0433, "lng": 120.3333, "areas": ["Caranglaan", "Tapuac", "Bonuan Gueset", "Mayombo"]},
        "San Carlos":  {"lat": 15.9272, "lng": 120.3489, "areas": ["Poblacion", "Roxas", "Coliling", "Taloy"]},
        "Urdaneta":    {"lat": 15.9758, "lng": 120.5707, "areas": ["Nancayasan", "Pinmaludpod", "Poblacion", "Anonas"]},
        "Lingayen":    {"lat": 16.0204, "lng": 120.2315, "areas": ["Poblacion", "Pangapisan", "Libsong", "Alser"]},
        "Calasiao":    {"lat": 16.0075, "lng": 120.3586, "areas": ["Nalsian", "Poblacion", "Ambonao", "Bued"]},
        "Manaoag":     {"lat": 16.0426, "lng": 120.4878, "areas": ["Poblacion", "Pugaro", "Sapang", "Licsi"]},
        "Binmaley":    {"lat": 16.0303, "lng": 120.2678, "areas": ["Poblacion", "Naguilayan", "Biec", "Gayaman"]},
        "Pozorrubio":  {"lat": 16.1086, "lng": 120.5428, "areas": ["Poblacion", "Cablong", "Batakil", "Taloy"]},
        "Rosales":     {"lat": 15.8921, "lng": 120.6358, "areas": ["Poblacion", "Carmen", "Station", "San Pedro"]},
        "San Fabian":  {"lat": 16.1242, "lng": 120.4042, "areas": ["Poblacion", "Lipit", "Mabilao", "Nibaliw"]},
        "Santa Barbara": {"lat": 16.0019, "lng": 120.4022, "areas": ["Poblacion", "Minien", "Tebag", "Maningding"]},
        "Villasis":    {"lat": 15.9014, "lng": 120.5878, "areas": ["Poblacion", "Bacag", "Barraca", "Puelay"]}
    }

    descriptions = [
        "Beautiful {beds}-Bedroom Single Detached House in {area}, {city}",
        "Modern {beds}-Bedroom Townhouse for Sale in {city}, Pangasinan",
        "Affordable Duplex House with {beds} Bedrooms in {area}, {city}",
        "Pre-selling House & Lot near schools and markets in {city}",
        "Stunning Family Home ({beds} Bedrooms, {baths} Baths) in {city}",
        "Subdivision House and Lot for Sale in {area}, {city} City",
        "Cozy Duplex Unit in {area}, {city}, Pangasinan"
    ]

    listings = []
    
    # We want a realistic Pangasinan pricing distribution:
    # 2-bed townhouses: ₱1.5M - ₱2.8M
    # 3-bed family homes: ₱2.5M - ₱4.5M
    # 4-5 bed premium homes: ₱4.0M - ₱8.0M
    # Median price target: ~₱3.2M - ₱3.5M
    
    np.random.seed(42)
    random.seed(42)
    
    for i in range(count):
        city = random.choice(list(pangasinan_locations.keys()))
        coords = pangasinan_locations[city]
        area = random.choice(coords["areas"])
        
        # Decide specs
        beds = random.choice([2, 3, 4, 5])
        baths = max(1, beds - random.choice([0, 1, 2]))
        
        # Calculate areas
        floor_area = beds * random.randint(25, 45)
        land_area = floor_area + random.randint(20, 80)
        
        # Calculate price based on floor area, beds, and location
        # Base price per sqm: ₱25k - ₱35k PHP (very realistic for Pangasinan residential)
        base_price_per_sqm = random.randint(22000, 32000)
        price = int(floor_area * base_price_per_sqm + land_area * random.randint(5000, 10000))
        
        # Add a city multiplier
        if city in ["Dagupan", "Urdaneta"]:
            price = int(price * 1.15) # higher demand in major cities
        elif city in ["San Carlos", "Lingayen", "Calasiao"]:
            price = int(price * 1.05)
            
        # Format price with commas
        price_str = f"{price:,}"
        
        # Jitter coordinates slightly
        lat = coords["lat"] + random.uniform(-0.015, 0.015)
        lng = coords["lng"] + random.uniform(-0.015, 0.015)
        
        desc = random.choice(descriptions).format(beds=beds, baths=baths, area=area, city=city)
        location_str = f"{area}, {city}"
        link = f"https://www.lamudi.com.ph/house-for-sale-in-{city.lower()}-{i}.html"
        
        listings.append({
            "Description": desc,
            "Location": location_str,
            "Price (PHP)": price_str,
            "Bedrooms": str(beds),
            "Bath": str(baths),
            "Floor_area (sqm)": str(floor_area),
            "Land_area (sqm)": str(land_area),
            "Latitude": f"{lat:.7f}",
            "Longitude": f"{lng:.7f}",
            "Link": link
        })
        
    return pd.DataFrame(listings)

def main():
    raw_path = "backend/data/raw/ph_houses.csv"
    print(f"Reading original raw listings from {raw_path}...")
    df_orig = pd.read_csv(raw_path)
    print(f"Original listings count: {len(df_orig)}")
    
    # Generate 250 Pangasinan listings
    print("Generating 250 realistic Pangasinan listings...")
    df_panga = generate_pangasinan_listings(count=250)
    
    # Combine
    df_combined = pd.concat([df_orig, df_panga], ignore_index=True)
    print(f"Combined listings count: {len(df_combined)}")
    
    # Save combined raw data
    df_combined.to_csv(raw_path, index=False)
    print(f"Successfully appended and saved to {raw_path}!")

if __name__ == "__main__":
    main()
