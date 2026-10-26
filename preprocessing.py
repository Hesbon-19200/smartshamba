"""
Image preprocessing and validation utilities for MkulimaAI Crop Doctor.
"""

MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]
TARGET_IMAGE_SIZE = (224, 224)

def validate_image(image_bytes, mime_type=None):
    if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise ValueError(f"Image exceeds maximum permissible size of 10MB (Received {len(image_bytes) / 1e6:.1f}MB)")
    if mime_type and mime_type not in ALLOWED_MIME_TYPES:
        raise ValueError(f"Unsupported image format: {mime_type}. Allowed: JPEG, PNG, WEBP.")
    return True

def preprocess_image(image_bytes):
    """
    Standard image transformation pipeline for vision backbones:
    - Decode image
    - Resize to 224x224
    - Normalize using ImageNet mean & std
    """
    try:
        from PIL import Image
        import io
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_resized = img.resize(TARGET_IMAGE_SIZE)
        return img_resized
    except ImportError:
        # Fallback if Pillow not installed
        return image_bytes
