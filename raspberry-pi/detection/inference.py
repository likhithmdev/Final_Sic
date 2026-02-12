"""
Inference Pipeline
Handles frame capture, preprocessing, and detection
"""

import cv2
import numpy as np
from typing import Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class InferencePipeline:
    """Manages camera capture and inference pipeline"""
    
    def __init__(self, camera_id: int = 0, resolution: Tuple[int, int] = (640, 480)):
        """
        Initialize camera and inference settings
        
        Args:
            camera_id: Camera device ID
            resolution: Target resolution (width, height)
        """
        self.camera_id = camera_id
        self.resolution = resolution
        self.cap = None
        self._init_camera()
    
    def _init_camera(self):
        """Initialize camera capture"""
        try:
            self.cap = cv2.VideoCapture(self.camera_id)
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.resolution[0])
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.resolution[1])
            
            if not self.cap.isOpened():
                raise RuntimeError("Failed to open camera")
            
            logger.info(f"Camera initialized: {self.resolution[0]}x{self.resolution[1]}")
        except Exception as e:
            logger.error(f"Camera initialization failed: {e}")
            raise
    
    def capture_frame(self) -> Optional[np.ndarray]:
        """
        Capture a single frame from camera
        
        Returns:
            Frame as numpy array or None if capture failed
        """
        if self.cap is None or not self.cap.isOpened():
            logger.error("Camera not available")
            return None
        
        ret, frame = self.cap.read()
        
        if not ret:
            logger.warning("Failed to capture frame")
            return None
        
        return frame
    
    def release(self):
        """Release camera resources"""
        if self.cap is not None:
            self.cap.release()
            logger.info("Camera released")
    
    def __del__(self):
        """Cleanup on deletion"""
        self.release()
