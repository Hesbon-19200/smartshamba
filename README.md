# MkulimaAI Machine Learning Pipeline

## Overview
MkulimaAI employs a dual-ML architecture tailored for smallholder farmers in East Africa:
1. **Tabular Decision & Yield/Profit Prediction Engine**: Evaluates agro-economic factors (county, soil type, irrigation access, input costs, and historical market volatility) to forecast estimated yield, revenue, net profit, and multi-factor risk scores.
2. **Computer Vision Leaf Pathology Engine**: Analyzes crop leaf photos to detect common conditions (e.g. Tomato Early Blight, Maize Fall Armyworm, Potato Late Blight) and returns confidence, observed visual indicators, and safe next steps.

---

## Tabular Pipeline Architecture

```
/ml
  /data
    generate_dataset.py      # Synthesizes 1,500+ smallholder farm records based on KALRO crop budgets
    kenya_farm_data.csv       # Calibration dataset across Kenyan agro-ecological zones
  /models
    metrics.json             # Evaluated metrics (R², RMSE, MAE)
  /training
    train_model.py           # Multi-model benchmarking (RandomForest vs GradientBoosting)
  /inference
    predict.py               # Inference execution module
```

### Models Benchmarked
- **RandomForestRegressor**: `n_estimators=100`, `max_depth=12`
  - $R^2$: `0.8842`
  - $MAE$: `KES 12,600`
  - $RMSE$: `KES 18,450`
- **GradientBoostingRegressor**: `learning_rate=0.08`, `max_depth=5`
  - $R^2$: `0.8695`
  - $MAE$: `KES 13,420`
  - $RMSE$: `KES 19,800`

### Training Commands
```bash
# 1. Install dependencies
pip install -r ml/requirements.txt

# 2. Generate calibrated dataset
python ml/data/generate_dataset.py

# 3. Train models and generate evaluation metrics
python ml/training/train_model.py

# 4. Test inference
python ml/inference/predict.py '{"cropType": "Tomatoes", "farmSizeAcres": 2.0, "county": "Kisii"}'
```

---

## Important Scientific Disclaimer
All machine learning outputs generated in this MVP are structured as **Demo Model Baselines** and decision-support estimates. They must **never** be interpreted as guaranteed agronomic outcomes. Predictions are accompanied by transparent Explainable AI factor breakdowns.
