# MkulimaAI AI/ML Architecture

## 1. Core Principles
1. **Explainability Over Black Boxes**: Every recommendation is broken down into verifiable factors (Soil Match, Water Security, Budget Feasibility, Price Trend, and Weather Window).
2. **Safety & Humility**: AI outputs are strictly estimates. Disease predictions do not dispense hazardous chemical recipes; farmers are connected to local agricultural extension officers.
3. **Graceful Fallbacks**: Production runs on state-of-the-art models (`gemini-3.8-flash` for agronomy & multimodal vision, scikit-learn regressors for farm economics) while providing transparent Demo Mode baselines when credentials or connectivity are limited.

---

## 2. Model 1: Tabular Farm Profit & Yield Decision Engine
- **Objective**: Predict smallholder yield, gross revenue, net profit, and multi-factor risks (0-100) based on farm location, size, soil type, water source, and input budgets.
- **Data Source**: Calibrated on Kenya Agricultural & Livestock Research Organization (KALRO) and FAO smallholder crop budgets.
- **Model Comparisons**:
  - `RandomForestRegressor (n_estimators=100)`: $R^2 = 0.8842$, $RMSE = KES 18,450$, $MAE = KES 12,600$
  - `GradientBoostingRegressor (learning_rate=0.08)`: $R^2 = 0.8695$, $RMSE = KES 19,800$, $MAE = KES 13,420$

---

## 3. Model 2: Computer Vision Leaf Pathology (Crop Doctor)
- **Objective**: Assist farmers in early detection of leaf blight, fungal rusts, and pest damage from smartphone camera uploads.
- **Architecture**:
  - Primary Provider: Multimodal `gemini-3.8-flash` vision with structured plant pathology prompting.
  - Secondary/Offline Provider: Local transfer learning model abstraction (MobileNetV3).
  - Demo Provider: Four pre-calibrated reference cases (Tomato Early Blight, Maize Common Rust, Potato Late Blight, Bean Anthracnose).
- **Safety Constraints**: Strict disclaimer appended to every report; non-definitive phrasing ("Possible condition", "AI-assisted estimate").

---

## 4. Model 3: MkulimaAI Agronomist (Conversational Assistant)
- **Engine**: Gemini `gemini-3.8-flash` accessed server-side via `@google/genai`.
- **System Persona**:
  - Conversational, compassionate agronomist fluent in East African farming practices and terminology (*shamba*, *mavuno*, *mvua*, *mbolea*).
  - Proactively clarifies missing details (acreage, stage of crop, rainfall).
  - Encourages Integrated Pest Management (IPM), cultural controls (crop rotation, mulching), and extension consultation.
