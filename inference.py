"""
Computer Vision Inference Entrypoint for MkulimaAI Crop Doctor.
Accepts image file path or bytes, runs validation and inference, returns JSON diagnosis.
"""

import sys
import json
import os

try:
    from model import DemoModelProvider, LocalModelProvider
    from preprocessing import validate_image, preprocess_image
except ImportError:
    from ml.vision.model import DemoModelProvider, LocalModelProvider
    from ml.vision.preprocessing import validate_image, preprocess_image

def run_vision_inference(image_path, crop_type="Tomatoes"):
    provider = DemoModelProvider()
    
    if not os.path.exists(image_path):
        # Demo simulation when testing without physical file
        return provider.predict_disease(None, crop_type)
        
    with open(image_path, "rb") as f:
        img_bytes = f.read()
        
    validate_image(img_bytes)
    _ = preprocess_image(img_bytes)
    
    result = provider.predict_disease(img_bytes, crop_type)
    return result

if __name__ == "__main__":
    crop = sys.argv[1] if len(sys.argv) > 1 else "Tomatoes"
    path = sys.argv[2] if len(sys.argv) > 2 else "sample.jpg"
    print(json.dumps(run_vision_inference(path, crop), indent=2))
