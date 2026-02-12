"""
TensorFlow Lite Waste Classification Model Handler
Lightweight alternative to YOLO for Raspberry Pi 4 (4GB).

Expected model: Teachable Machine exported TFLite classifier.
Outputs a single label with confidence.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Dict, List, Tuple

import cv2
import numpy as np

try:
    # Recommended on Raspberry Pi
    from tflite_runtime.interpreter import Interpreter
except Exception:  # pragma: no cover
    # Fallback for environments that use full TF
    from tensorflow.lite.python.interpreter import Interpreter  # type: ignore

logger = logging.getLogger(__name__)


@dataclass
class Prediction:
    label: str
    confidence: float


class TFLiteWasteClassifier:
    """
    Runs TFLite inference and produces a detection summary compatible with MQTT publishing.
    """

    def __init__(
        self,
        model_path: str,
        labels_path: str,
        input_size: Tuple[int, int] = (224, 224),
        conf_threshold: float = 0.65,
    ):
        self.model_path = model_path
        self.labels_path = labels_path
        self.input_size = input_size
        self.conf_threshold = conf_threshold

        self.labels = self._load_labels(labels_path)

        logger.info("Loading TFLite model from %s", model_path)
        self.interpreter = Interpreter(model_path=model_path)
        self.interpreter.allocate_tensors()

        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

        # Teachable Machine models usually have 1 input tensor.
        self.input_index = self.input_details[0]["index"]
        self.output_index = self.output_details[0]["index"]

        self.input_dtype = self.input_details[0]["dtype"]
        logger.info("TFLite model loaded. input dtype=%s labels=%d", self.input_dtype, len(self.labels))

    def _load_labels(self, path: str) -> List[str]:
        with open(path, "r", encoding="utf-8") as f:
            lines = [ln.strip() for ln in f.readlines()]
        # Teachable Machine labels.txt sometimes has "0 dry" format
        labels: List[str] = []
        for ln in lines:
            if not ln:
                continue
            parts = ln.split(maxsplit=1)
            if len(parts) == 2 and parts[0].isdigit():
                labels.append(parts[1].strip())
            else:
                labels.append(ln)
        return labels

    def _preprocess(self, frame_bgr: np.ndarray) -> np.ndarray:
        # Resize to expected input
        resized = cv2.resize(frame_bgr, self.input_size, interpolation=cv2.INTER_LINEAR)
        rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)

        # Model expects either uint8 [0..255] or float32 [0..1]
        if self.input_dtype == np.uint8:
            tensor = rgb.astype(np.uint8)
        else:
            tensor = (rgb.astype(np.float32) / 255.0).astype(self.input_dtype)

        # Add batch dimension
        return np.expand_dims(tensor, axis=0)

    def _postprocess(self, output: np.ndarray) -> Prediction:
        # Output shape commonly: (1, num_classes)
        scores = np.squeeze(output)

        # Dequantize if needed
        q = self.output_details[0].get("quantization", (0.0, 0))
        scale, zero_point = q if isinstance(q, (tuple, list)) else (0.0, 0)
        if scale and output.dtype in (np.uint8, np.int8):
            scores = scale * (scores.astype(np.float32) - float(zero_point))

        idx = int(np.argmax(scores))
        conf = float(scores[idx])
        label = self.labels[idx] if idx < len(self.labels) else str(idx)

        # If the model outputs logits (not probabilities), conf may be outside [0,1].
        # For Teachable Machine it is usually probabilities already.
        if conf > 1.0:
            conf = float(1.0 / (1.0 + np.exp(-conf)))

        return Prediction(label=label, confidence=round(conf, 2))

    def predict(self, frame_bgr: np.ndarray) -> Prediction:
        input_tensor = self._preprocess(frame_bgr)
        self.interpreter.set_tensor(self.input_index, input_tensor)
        self.interpreter.invoke()
        output = self.interpreter.get_tensor(self.output_index)
        return self._postprocess(output)

    # ----- Compatibility with existing pipeline -----

    def detect(self, frame_bgr: np.ndarray) -> List[Dict]:
        """
        For compatibility with the YOLO path, we return a list with one "detection".
        """
        pred = self.predict(frame_bgr)
        return [{"class": pred.label, "confidence": pred.confidence, "bbox": None}]

    def get_detection_summary(self, detections: List[Dict]) -> Dict:
        """
        Summary payload for MQTT: {count, objects, destination}.
        If confidence < threshold -> destination='reject'
        """
        if not detections:
            return {"count": 0, "objects": [], "destination": "none"}

        best = detections[0]
        label = best.get("class", "unknown")
        confidence = float(best.get("confidence", 0.0))

        destination = label if confidence >= self.conf_threshold else "reject"

        return {
            "count": 1,
            "objects": [{"class": label, "confidence": round(confidence, 2)}],
            "destination": destination,
            "confidence": round(confidence, 2),
        }

