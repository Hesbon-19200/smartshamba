"""
MkulimaAI - Tabular Dataset Generator for Kenyan Smallholder Farm Economics.
Generates realistic agricultural economic data modeling smallholder farming conditions
across Kenyan counties (Kisii, Nakuru, Uasin Gishu, Kiambu, Machakos, Meru, etc.)
calibrated with KALRO (Kenya Agricultural and Livestock Research Organization) crop budgets.
"""

import os
import random
import csv

COUNTIES = [
    ("Kisii", "Highland moist", 1800, "Volcanic Red Loam"),
    ("Nakuru", "Rift Valley medium", 1000, "Loam"),
    ("Uasin Gishu", "Highland grain basket", 1200, "Clay Loam"),
    ("Kiambu", "Central fertile highland", 1400, "Volcanic Red Loam"),
    ("Machakos", "Semi-arid eastern", 700, "Sandy Loam"),
    ("Meru", "Mount Kenya slopes", 1500, "Volcanic Red Loam"),
    ("Trans Nzoia", "Highland maize belt", 1300, "Loam"),
    ("Kakamega", "Western moist", 1700, "Clay Loam"),
]

CROPS = {
    "Tomatoes": {
        "base_yield_per_acre": 280,  # 64kg crates
        "yield_variance": 60,
        "base_price_kes": 3200,
        "seed_cost_acre": 14000,
        "fert_cost_acre": 22000,
        "labour_cost_acre": 26000,
        "pest_cost_acre": 18000,
        "water_sensitivity": 0.85,
        "soil_pref": ["Volcanic Red Loam", "Loam"],
    },
    "Maize": {
        "base_yield_per_acre": 28,  # 90kg bags
        "yield_variance": 6,
        "base_price_kes": 4200,
        "seed_cost_acre": 5500,
        "fert_cost_acre": 16000,
        "labour_cost_acre": 12000,
        "pest_cost_acre": 4000,
        "water_sensitivity": 0.60,
        "soil_pref": ["Loam", "Clay Loam", "Volcanic Red Loam"],
    },
    "Beans": {
        "base_yield_per_acre": 10,  # 90kg bags
        "yield_variance": 3,
        "base_price_kes": 9500,
        "seed_cost_acre": 4500,
        "fert_cost_acre": 8000,
        "labour_cost_acre": 9000,
        "pest_cost_acre": 3500,
        "water_sensitivity": 0.45,
        "soil_pref": ["Loam", "Clay Loam", "Sandy Loam"],
    },
    "Potatoes": {
        "base_yield_per_acre": 80,  # 50kg bags
        "yield_variance": 20,
        "base_price_kes": 2800,
        "seed_cost_acre": 24000,
        "fert_cost_acre": 18000,
        "labour_cost_acre": 16000,
        "pest_cost_acre": 12000,
        "water_sensitivity": 0.70,
        "soil_pref": ["Volcanic Red Loam", "Loam"],
    },
    "Cabbages / Vegetables": {
        "base_yield_per_acre": 5500,  # heads
        "yield_variance": 1200,
        "base_price_kes": 45,
        "seed_cost_acre": 7500,
        "fert_cost_acre": 14000,
        "labour_cost_acre": 14000,
        "pest_cost_acre": 8000,
        "water_sensitivity": 0.75,
        "soil_pref": ["Loam", "Volcanic Red Loam", "Clay Loam"],
    },
}

WATER_SOURCES = ["Rainfed (Seasonal)", "Borehole / Well", "River / Stream Gravity", "Drip Irrigation Installed"]
SOILS = ["Volcanic Red Loam", "Loam", "Clay Loam", "Sandy Loam", "Black Cotton Soil"]

def generate_records(num_records=1200):
    records = []
    random.seed(42)

    for i in range(num_records):
        county_info = random.choice(COUNTIES)
        county, eco_zone, rainfall_mm, def_soil = county_info
        crop_name = random.choice(list(CROPS.keys()))
        crop = CROPS[crop_name]

        acres = round(random.uniform(0.5, 5.0), 1)
        soil = random.choice(SOILS)
        water = random.choice(WATER_SOURCES)
        experience_yrs = random.choice([1, 2, 3, 5, 8, 12, 20])

        # Water modifier
        water_mult = 1.0
        if water == "Drip Irrigation Installed":
            water_mult = 1.25
        elif water == "Borehole / Well" or water == "River / Stream Gravity":
            water_mult = 1.15
        elif water == "Rainfed (Seasonal)":
            water_mult = 0.85 if rainfall_mm < 1100 else 1.0

        # Soil match modifier
        soil_mult = 1.1 if soil in crop["soil_pref"] else 0.88

        # Experience modifier
        exp_mult = 1.0 + (min(experience_yrs, 10) * 0.015)

        # Input cost calculation
        seed_cost = round(crop["seed_cost_acre"] * acres * random.uniform(0.9, 1.15))
        fert_cost = round(crop["fert_cost_acre"] * acres * random.uniform(0.85, 1.2))
        labour_cost = round(crop["labour_cost_acre"] * acres * random.uniform(0.9, 1.1))
        pest_cost = round(crop["pest_cost_acre"] * acres * random.uniform(0.85, 1.25))
        other_cost = round((seed_cost + fert_cost) * 0.08)
        total_cost = seed_cost + fert_cost + labour_cost + pest_cost + other_cost

        # Yield output
        base_yield = crop["base_yield_per_acre"] * acres
        actual_yield = round(
            base_yield * water_mult * soil_mult * exp_mult + random.gauss(0, crop["yield_variance"] * acres * 0.4)
        )
        actual_yield = max(actual_yield, round(base_yield * 0.3))

        # Selling price
        market_price = round(crop["base_price_kes"] * random.uniform(0.85, 1.25))
        revenue = round(actual_yield * market_price)
        profit = revenue - total_cost
        roi_pct = round((profit / total_cost) * 100, 1) if total_cost > 0 else 0

        # Risk score calculation (0 - 100)
        weather_risk = 55 if water == "Rainfed (Seasonal)" and rainfall_mm < 1000 else 25
        market_risk = 60 if crop_name in ["Tomatoes", "Cabbages / Vegetables"] else 30
        disease_risk = 50 if crop_name in ["Tomatoes", "Potatoes"] else 25
        risk_score = round((weather_risk * 0.35) + (market_risk * 0.35) + (disease_risk * 0.30))

        records.append({
            "id": f"REC-{i+1:04d}",
            "county": county,
            "crop": crop_name,
            "acres": acres,
            "soil_type": soil,
            "water_source": water,
            "annual_rainfall_mm": rainfall_mm,
            "experience_years": experience_yrs,
            "seed_cost_kes": seed_cost,
            "fert_cost_kes": fert_cost,
            "labour_cost_kes": labour_cost,
            "pest_cost_kes": pest_cost,
            "other_cost_kes": other_cost,
            "total_cost_kes": total_cost,
            "market_price_kes": market_price,
            "yield": actual_yield,
            "revenue_kes": revenue,
            "profit_kes": profit,
            "roi_percent": roi_pct,
            "risk_score": risk_score
        })

    return records

def save_csv():
    records = generate_records(1500)
    data_dir = os.path.dirname(__file__)
    output_path = os.path.join(data_dir, "kenya_farm_data.csv")
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=records[0].keys())
        writer.writeheader()
        writer.writerows(records)
    print(f"Generated {len(records)} Kenyan smallholder agricultural records at {output_path}")

if __name__ == "__main__":
    save_csv()
