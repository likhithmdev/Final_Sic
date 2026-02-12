"""
Detection Utilities
Helper functions for detection processing
"""

import cv2
import numpy as np
from typing import List, Dict, Tuple


def draw_detections(frame: np.ndarray, detections: List[Dict]) -> np.ndarray:
    """
    Draw bounding boxes on frame
    
    Args:
        frame: Input frame
        detections: List of detection dictionaries
        
    Returns:
        Frame with drawn boxes
    """
    output = frame.copy()
    
    colors = {
        'dry': (135, 206, 235),      # Sky Blue
        'wet': (34, 139, 34),        # Forest Green
        'electronic': (255, 165, 0)  # Orange
    }
    
    for det in detections:
        bbox = det['bbox']
        x1, y1, x2, y2 = map(int, bbox)
        
        class_name = det['class']
        confidence = det['confidence']
        color = colors.get(class_name, (0, 0, 255))
        
        # Draw rectangle
        cv2.rectangle(output, (x1, y1), (x2, y2), color, 2)
        
        # Draw label
        label = f"{class_name}: {confidence:.2f}"
        (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
        cv2.rectangle(output, (x1, y1 - h - 10), (x1 + w, y1), color, -1)
        cv2.putText(output, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 
                   0.5, (0, 0, 0), 1)
    
    return output


def filter_overlapping_boxes(detections: List[Dict], iou_threshold: float = 0.5) -> List[Dict]:
    """
    Remove overlapping detections using NMS
    
    Args:
        detections: List of detection dictionaries
        iou_threshold: IOU threshold for suppression
        
    Returns:
        Filtered detections
    """
    if len(detections) == 0:
        return []
    
    boxes = np.array([d['bbox'] for d in detections])
    scores = np.array([d['confidence'] for d in detections])
    
    x1 = boxes[:, 0]
    y1 = boxes[:, 1]
    x2 = boxes[:, 2]
    y2 = boxes[:, 3]
    
    areas = (x2 - x1) * (y2 - y1)
    order = scores.argsort()[::-1]
    
    keep = []
    while len(order) > 0:
        i = order[0]
        keep.append(i)
        
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])
        
        w = np.maximum(0, xx2 - xx1)
        h = np.maximum(0, yy2 - yy1)
        
        inter = w * h
        iou = inter / (areas[i] + areas[order[1:]] - inter)
        
        inds = np.where(iou <= iou_threshold)[0]
        order = order[inds + 1]
    
    return [detections[i] for i in keep]


def calculate_bin_angles() -> Dict[str, int]:
    """
    Calculate servo angles for each bin
    
    Returns:
        Dictionary mapping bin type to servo angle
    """
    return {
        'dry': 60,
        'wet': 120,
        'electronic': 180,
        'processing': 0
    }
