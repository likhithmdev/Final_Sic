"""
Configuration Settings
Central configuration for Raspberry Pi system
"""

import os


class Config:
    """System configuration"""
    
    # MQTT Broker settings
    MQTT_BROKER = os.getenv('MQTT_BROKER', 'broker.hivemq.com')
    MQTT_PORT = int(os.getenv('MQTT_PORT', 1883))
    MQTT_CLIENT_ID = os.getenv('MQTT_CLIENT_ID', 'smartbin_pi_001')
    
    # Detector selection
    # - yolo: Ultralytics YOLOv8 (heavier)
    # - tflite: Teachable Machine TFLite classifier (lightweight, recommended for Pi 4GB)
    DETECTOR_TYPE = os.getenv('DETECTOR_TYPE', 'tflite').lower()

    # Model settings (YOLO)
    MODEL_PATH = os.getenv('MODEL_PATH', '../models/yolo-waste.pt')

    # Model settings (TFLite)
    TFLITE_MODEL_PATH = os.getenv('TFLITE_MODEL_PATH', '../models/model.tflite')
    TFLITE_LABELS_PATH = os.getenv('TFLITE_LABELS_PATH', '../models/labels.txt')
    TFLITE_INPUT_SIZE = (224, 224)

    # Confidence threshold used for routing to reject
    CONFIDENCE_THRESHOLD = float(os.getenv('CONF_THRESHOLD', 0.65))
    
    # Camera settings (tuned for Raspberry Pi 4 - lightweight)
    CAMERA_ID = int(os.getenv('CAMERA_ID', 0))
    # Lower resolution for smoother performance on Pi
    CAMERA_RESOLUTION = (320, 240)
    # Match inference resolution to TFLite input size
    INFERENCE_RESOLUTION = (224, 224)
    
    # Detection settings
    DETECTION_FPS = int(os.getenv('DETECTION_FPS', 5))
    ENABLE_PREPROCESSING = os.getenv('ENABLE_PREPROCESSING', 'false').lower() == 'true'
    
    # Bin settings
    BIN_DEPTH = float(os.getenv('BIN_DEPTH', 30.0))  # cm
    BIN_FULL_THRESHOLD = float(os.getenv('BIN_FULL_THRESHOLD', 80.0))  # percentage
    
    # Servo settings
    SERVO_SPEED = float(os.getenv('SERVO_SPEED', 1.0))
    
    # System settings
    DEBUG_MODE = os.getenv('DEBUG_MODE', 'false').lower() == 'true'
    # Use higher log level by default for less console overhead on Pi
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'WARNING')
    
    # Monitoring intervals
    BIN_STATUS_INTERVAL = int(os.getenv('BIN_STATUS_INTERVAL', 30))  # seconds
    SYSTEM_STATUS_INTERVAL = int(os.getenv('SYSTEM_STATUS_INTERVAL', 60))  # seconds


# Development/Testing config
class DevConfig(Config):
    """Development configuration"""
    DEBUG_MODE = True
    LOG_LEVEL = 'DEBUG'
    MQTT_BROKER = 'localhost'


# Production config
class ProdConfig(Config):
    """Production configuration"""
    DEBUG_MODE = False
    LOG_LEVEL = 'WARNING'


def get_config():
    """Get configuration based on environment"""
    env = os.getenv('ENVIRONMENT', 'production')
    
    if env == 'development':
        return DevConfig()
    else:
        return ProdConfig()
