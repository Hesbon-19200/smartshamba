# MkulimaAI Computer Vision Architecture - Crop Doctor

## Overview
The Crop Doctor vision pipeline evaluates plant leaf imagery to assist smallholder farmers in identifying potential diseases early, reducing post-planting loss while adhering to agronomic safety boundaries.

## Architecture

```
/ml/vision
  model.py           # Provider abstraction: CropDiseaseModelProvider (Demo, Local, External)
  preprocessing.py   # Validation (10MB limit, JPEG/PNG/WEBP) & 224x224 standardization
  inference.py       # Execution pipeline returning structured diagnosis & safety boundaries
```

## Provider Strategy
1. **Server-Side Gemini Multimodal Model (`gemini-3.8-flash`)**: High-fidelity multimodal visual analysis analyzing real leaf photos, lesions, patterns, and contextual symptoms.
2. **Local Model Provider**: MobileNetV3 / ResNet-18 transfer learning backbone for offline/on-premise environments.
3. **Demo Provider**: Pre-calibrated pathology cases (Tomato Early Blight, Maize Common Rust, Potato Late Blight, Bean Anthracnose) enabling reliable hackathon demonstrations without API keys or active internet connectivity.

## Safety & Ethics Standard
- Predictions are strictly labeled as **"AI-assisted estimates, not a confirmed laboratory diagnosis"**.
- The system explicitly refuses to recommend hazardous pesticide dosages or unvetted chemical mixtures, directing farmers to local agricultural extension officers (Bwana Shamba).
