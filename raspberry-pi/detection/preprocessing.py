"""
Image Preprocessing Utilities
Frame processing and optimization for YOLO inference
"""

import cv2
import numpy as np
from typing import Tuple


def resize_frame(frame: np.ndarray, target_size: Tuple[int, int] = (416, 416)) -> np.ndarray:
    """
    Resize frame while maintaining aspect ratio
    
    Args:
        frame: Input frame
        target_size: Target dimensions (width, height)
        
    Returns:
        Resized frame
    """
    return cv2.resize(frame, target_size, interpolation=cv2.INTER_LINEAR)


def normalize_frame(frame: np.ndarray) -> np.ndarray:
    """
    Normalize pixel values to [0, 1]
    
    Args:
        frame: Input frame
        
    Returns:
        Normalized frame
    """
    return frame.astype(np.float32) / 255.0


def enhance_contrast(frame: np.ndarray) -> np.ndarray:
    """
    Enhance frame contrast using CLAHE
    
    Args:
        frame: Input BGR frame
        
    Returns:
        Contrast-enhanced frame
    """
    lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    
    enhanced = cv2.merge([l, a, b])
    return cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)


def denoise_frame(frame: np.ndarray) -> np.ndarray:
    """
    Apply denoising filter
    
    Args:
        frame: Input frame
        
    Returns:
        Denoised frame
    """
    return cv2.fastNlMeansDenoisingColored(frame, None, 10, 10, 7, 21)


def preprocess_for_inference(frame: np.ndarray, 
                            resize: bool = True,
                            enhance: bool = False) -> np.ndarray:
    """
    Complete preprocessing pipeline
    
    Args:
        frame: Raw camera frame
        resize: Whether to resize frame
        enhance: Whether to apply contrast enhancement
        
    Returns:
        Preprocessed frame ready for inference
    """
    processed = frame.copy()
    
    if enhance:
        processed = enhance_contrast(processed)
    
    if resize:
        processed = resize_frame(processed)
    
    return processed
