"""
Inference Pipeline
Handles frame capture, preprocessing, and detection.

Supports two backends:
- OpenCV VideoCapture (USB webcams, etc.)
- Picamera2 / libcamera (rpicam stack), auto-selected if OpenCV fails
"""

import logging
from typing import Optional, Tuple

import cv2
import numpy as np

logger = logging.getLogger(__name__)

try:
    from picamera2 import Picamera2

    PICAMERA2_AVAILABLE = True
except Exception:  # pragma: no cover
    Picamera2 = None  # type: ignore
    PICAMERA2_AVAILABLE = False


class InferencePipeline:
    """Manages camera capture and inference pipeline"""

    def __init__(self, camera_id: int = 0, resolution: Tuple[int, int] = (640, 480)):
        """
        Initialize camera and inference settings

        Args:
            camera_id: Camera device ID (for OpenCV backend)
            resolution: Target resolution (width, height)
        """
        self.camera_id = camera_id
        self.resolution = resolution

        # Backend-specific handles
        self.cap = None  # OpenCV VideoCapture
        self.picam2 = None  # Picamera2 instance

        self._init_camera()

    # --------------------------------------------------------------------- #
    # Camera initialization
    # --------------------------------------------------------------------- #
    def _init_camera(self):
        """Initialize camera capture, preferring OpenCV but falling back to Picamera2."""
        # 1) Try OpenCV VideoCapture first (for USB webcams)
        try:
            cap = cv2.VideoCapture(self.camera_id)
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.resolution[0])
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.resolution[1])

            if cap.isOpened():
                ret, _ = cap.read()
                if ret:
                    self.cap = cap
                    logger.info(
                        f"Camera initialized via OpenCV (id={self.camera_id}) "
                        f"at {self.resolution[0]}x{self.resolution[1]}"
                    )
                    return
                else:
                    logger.warning(
                        "OpenCV camera opened but failed to read frame, "
                        "falling back to Picamera2 if available."
                    )
                    cap.release()
            else:
                logger.warning(
                    f"OpenCV could not open camera id={self.camera_id}, "
                    "falling back to Picamera2 if available."
                )
        except Exception as e:  # pragma: no cover
            logger.warning(f"OpenCV camera initialization error: {e}")

        # 2) Fallback: Picamera2 / rpicam stack (works with Pi cameras, often with USB via libcamera)
        if PICAMERA2_AVAILABLE:
            try:
                logger.info("Attempting to initialize camera via Picamera2")
                self.picam2 = Picamera2()
                config = self.picam2.create_video_configuration(
                    main={
                        "size": (self.resolution[0], self.resolution[1]),
                        "format": "BGR888",
                    }
                )
                self.picam2.configure(config)
                self.picam2.start()
                logger.info(
                    f"Camera initialized via Picamera2 at {self.resolution[0]}x{self.resolution[1]}"
                )
                return
            except Exception as e:
                logger.error(f"Picamera2 initialization failed: {e}")

        # If neither backend worked, raise a clear error
        raise RuntimeError(
            "Failed to initialize camera: neither OpenCV VideoCapture nor Picamera2 succeeded."
        )

    # --------------------------------------------------------------------- #
    # Capture / release
    # --------------------------------------------------------------------- #
    def capture_frame(self) -> Optional[np.ndarray]:
        """
        Capture a single frame from camera.

        Returns:
            Frame as numpy array (BGR) or None if capture failed
        """
        # OpenCV backend
        if self.cap is not None:
            if not self.cap.isOpened():
                logger.error("OpenCV camera not available")
                return None

            ret, frame = self.cap.read()
            if not ret:
                logger.warning("Failed to capture frame from OpenCV camera")
                return None

            return frame

        # Picamera2 backend
        if self.picam2 is not None:
            try:
                frame = self.picam2.capture_array()
                if frame is None:
                    logger.warning("Picamera2 returned empty frame")
                    return None

                # Picamera2 with BGR888 config already returns BGR
                return frame
            except Exception as e:
                logger.warning(f"Failed to capture frame from Picamera2: {e}")
                return None

        logger.error("No camera backend is initialized")
        return None

    def release(self):
        """Release camera resources"""
        if self.cap is not None:
            self.cap.release()
            logger.info("OpenCV camera released")

        if self.picam2 is not None:
            try:
                self.picam2.stop()
                logger.info("Picamera2 camera stopped")
            except Exception:
                pass

    def __del__(self):
        """Cleanup on deletion"""
        self.release()

