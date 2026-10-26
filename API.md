# MkulimaAI API Documentation

All endpoints return uniform JSON envelopes: `{ "success": boolean, "data": ... , "error"?: string }`.

## Endpoints Summary

### 1. Farm Profiles
- `GET /api/farms`: List farmer farms.
- `POST /api/farms`: Register new farm plot.

### 2. Decision Engine & Farm Analysis
- `POST /api/farm-analysis`: Run multi-step decision engine predicting yield, profit, ROI, and risks.
- `GET /api/farm-analysis`: Fetch past farm analyses.
- `GET /api/farm-analysis/:id`: Retrieve single analysis by ID.

### 3. Crop Doctor (Vision)
- `POST /api/crop-diagnosis`: Upload crop image (or use sample demo key) to analyze leaf health.
- `GET /api/crop-diagnosis`: Retrieve diagnosis scan history.
- `GET /api/crop-diagnosis/:id`: Retrieve single scan details.

### 4. AI Agronomist Chat
- `POST /api/agronomist/chat`: Send prompt to conversational assistant.
  - Body: `{ "message": string, "farmContext"?: object, "conversationHistory"?: array }`

### 5. Environmental & Market Feeds
- `GET /api/weather?county=Kisii`: Get real-time weather & 5-day forecast.
- `GET /api/market-prices`: Get latest Kenyan commodity prices across regional markets.

### 6. Admin & Hackathon Demo
- `GET /api/admin/metrics`: View model evaluation metrics (R², MAE, RMSE) and system health.
- `POST /api/hackathon/scenario`: One-click setup loading the Kisii County 2-acre tomato farmer scenario.
