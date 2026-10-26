"""
MkulimaAI Tabular Inference Module.
Takes farm input parameters and generates yield, revenue, profit, and risk estimations.
"""

import sys
import json

def predict_farm_outcomes(input_data):
    crop = input_data.get("cropType", "Tomatoes")
    acres = float(input_data.get("farmSizeAcres", 2.0))
    county = input_data.get("county", "Kisii")
    soil = input_data.get("soilType", "Volcanic Red Loam")
    water = input_data.get("waterAvailability", "River / Stream Gravity")
    
    seed_cost = float(input_data.get("seedCost", 28000))
    fert_cost = float(input_data.get("fertilizerCost", 44000))
    labour_cost = float(input_data.get("labourCost", 48000))
    pest_cost = float(input_data.get("pestCost", 34000))
    other_cost = float(input_data.get("otherCosts", 12000))
    
    total_cost = seed_cost + fert_cost + labour_cost + pest_cost + other_cost
    
    # Crop production baseline benchmarks (Per acre in Kenya)
    benchmarks = {
        "Tomatoes": {"base_yield": 280, "unit": "crates (64kg)", "price": 3200, "fav_soils": ["Volcanic Red Loam", "Loam"]},
        "Maize": {"base_yield": 28, "unit": "90kg bags", "price": 4200, "fav_soils": ["Loam", "Clay Loam", "Volcanic Red Loam"]},
        "Beans": {"base_yield": 10, "unit": "90kg bags", "price": 9500, "fav_soils": ["Loam", "Clay Loam", "Sandy Loam"]},
        "Potatoes": {"base_yield": 80, "unit": "50kg bags", "price": 2800, "fav_soils": ["Volcanic Red Loam", "Loam"]},
        "Bananas": {"base_yield": 450, "unit": "bunches", "price": 850, "fav_soils": ["Volcanic Red Loam", "Clay Loam"]},
        "Cabbages / Vegetables": {"base_yield": 5500, "unit": "heads", "price": 45, "fav_soils": ["Loam", "Volcanic Red Loam"]},
        "Onions": {"base_yield": 7000, "unit": "kg", "price": 80, "fav_soils": ["Sandy Loam", "Loam"]},
        "Watermelon": {"base_yield": 8500, "unit": "kg", "price": 38, "fav_soils": ["Sandy Loam", "Loam"]},
    }
    
    crop_info = benchmarks.get(crop, benchmarks["Tomatoes"])
    
    # Soil multiplier
    soil_mult = 1.1 if soil in crop_info["fav_soils"] else 0.88
    
    # Water multiplier
    if "Drip" in water:
        water_mult = 1.25
        water_risk = "Low"
        water_risk_score = 15
    elif "River" in water or "Borehole" in water:
        water_mult = 1.15
        water_risk = "Low"
        water_risk_score = 25
    elif "Rainfed" in water:
        water_mult = 0.95
        water_risk = "Medium" if county in ["Kisii", "Meru", "Uasin Gishu"] else "High"
        water_risk_score = 55
    else:
        water_mult = 0.80
        water_risk = "High"
        water_risk_score = 75
        
    estimated_yield = round(crop_info["base_yield"] * acres * soil_mult * water_mult)
    selling_price = crop_info["price"]
    revenue = round(estimated_yield * selling_price)
    profit = revenue - round(total_cost)
    roi = round((profit / total_cost) * 100, 1) if total_cost > 0 else 0
    break_even_yield = round(total_cost / selling_price, 1) if selling_price > 0 else 0
    
    # Multi-factor Suitability calculation (0 - 100)
    soil_score = 92 if soil in crop_info["fav_soils"] else 68
    water_score = 90 if "Drip" in water or "River" in water else (70 if "Rainfed" in water else 40)
    budget_fit = 90 if total_cost <= float(input_data.get("availableBudget", total_cost * 1.2)) else 60
    suitability_score = round((soil_score * 0.35) + (water_score * 0.35) + (budget_fit * 0.30))
    
    # Profit potential score (0 - 100)
    profit_potential = min(100, max(20, round(50 + (roi * 0.35))))
    
    overall_risk = "Low" if water_risk_score < 35 and roi > 40 else ("Medium" if water_risk_score < 60 else "High")
    
    return {
        "crop": crop,
        "acres": acres,
        "county": county,
        "totalCost": round(total_cost),
        "estimatedYield": estimated_yield,
        "yieldUnit": crop_info["unit"],
        "estimatedSellingPrice": selling_price,
        "estimatedRevenue": revenue,
        "estimatedProfit": profit,
        "roiPercent": roi,
        "breakEvenYield": break_even_yield,
        "suitabilityScore": suitability_score,
        "profitPotentialScore": profit_potential,
        "riskLevel": overall_risk,
        "isDemo": True,
        "modelType": "Demo Model (RandomForest/GBR Baseline)"
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        data = json.loads(sys.argv[1])
    else:
        data = {"cropType": "Tomatoes", "farmSizeAcres": 2.0, "county": "Kisii"}
    print(json.dumps(predict_farm_outcomes(data), indent=2))
