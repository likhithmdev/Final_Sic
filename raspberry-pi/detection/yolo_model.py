"""
YOLO Waste Detection Model Handler
Loads and manages YOLOv8 model for waste classification
"""

from ultralytics import YOLO
import cv2
import numpy as np
from typing import List, Dict, Tuple
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WasteDetector:
    """Handles YOLO model loading and inference for waste detection"""
    
    def __init__(self, model_path: str = "../models/yolo-waste.pt", conf_threshold: float = 0.5):
        """
        Initialize detector with model path
        
        Args:
            model_path: Path to YOLO weights
            conf_threshold: Confidence threshold for detections
        """
        self.model_path = model_path
        self.conf_threshold = conf_threshold
        self.model = None
        self.class_names = ['dry', 'wet', 'electronic']
        self._load_model()
    
    def _load_model(self):
        """Load YOLO model into memory"""
        try:
            logger.info(f"Loading YOLO model from {self.model_path}")
            self.model = YOLO(self.model_path)
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise
    
    def detect(self, frame: np.ndarray) -> List[Dict]:
        """
        Run detection on a single frame
        
        Args:
            frame: Input image as numpy array (BGR)
            
        Returns:
            List of detection dictionaries with class and confidence
        """
        if self.model is None:
            raise RuntimeError("Model not loaded")
        
        # Run inference
        results = self.model(frame, conf=self.conf_threshold, verbose=False)
        
        detections = []
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                
                detection = {
                    'class': self.class_names[class_id] if class_id < len(self.class_names) else 'unknown',
                    'confidence': round(confidence, 2),
                    'bbox': box.xyxy[0].tolist()  # [x1, y1, x2, y2]
                }
                detections.append(detection)
        
        logger.info(f"Detected {len(detections)} objects")
        return detections
    
    def get_detection_summary(self, detections: List[Dict]) -> Dict:
        """
        Create detection summary for MQTT publishing
        
        Args:
            detections: List of detection dictionaries
            
        Returns:
            Summary dictionary with count, objects, and destination
        """
        count = len(detections)
        
        # Determine destination
        if count == 0:
            destination = "none"
        elif count == 1:
            destination = detections[0]['class']
        else:
            destination = "processing"
        
        summary = {
            'count': count,
            'objects': [{'class': d['class'], 'confidence': d['confidence']} for d in detections],
            'destination': destination
        }
        
        return summary
