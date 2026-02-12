"""
Servo Motor Control
Controls sorting mechanism servo motor
"""

import RPi.GPIO as GPIO
import time
import logging

logger = logging.getLogger(__name__)


class ServoController:
    """Controls a single servo motor (for a single door/bin)"""
    
    def __init__(self, pin: int, frequency: int = 50):
        """
        Initialize servo controller
        
        Args:
            pin: GPIO pin number (BCM mode)
            frequency: PWM frequency in Hz
        """
        self.pin = pin
        self.frequency = frequency
        self.pwm = None
        self.current_angle = 0  # Start closed
        
        self._setup_gpio()
    
    def _setup_gpio(self):
        """Setup GPIO and PWM"""
        try:
            GPIO.setmode(GPIO.BCM)
            GPIO.setup(self.pin, GPIO.OUT)
            
            self.pwm = GPIO.PWM(self.pin, self.frequency)
            self.pwm.start(0)
            
            logger.info(f"Servo initialized on GPIO pin {self.pin}")
        except Exception as e:
            logger.error(f"GPIO setup failed: {e}")
            raise
    
    def _angle_to_duty_cycle(self, angle: int) -> float:
        """
        Convert angle to PWM duty cycle
        
        Args:
            angle: Target angle (0-180)
            
        Returns:
            Duty cycle percentage
        """
        # Standard servo: 2.5% (0°) to 12.5% (180°)
        return 2.5 + (angle / 180.0) * 10.0
    
    def rotate_to(self, angle: int, speed: float = 1.0):
        """
        Rotate servo to target angle smoothly
        
        Args:
            angle: Target angle (0-180)
            speed: Rotation speed multiplier
        """
        if not 0 <= angle <= 180:
            logger.warning(f"Invalid angle {angle}, clamping to 0-180")
            angle = max(0, min(180, angle))
        
        logger.info(f"Rotating servo on pin {self.pin} from {self.current_angle}° to {angle}°")
        
        # Smooth rotation
        step = 2 if angle > self.current_angle else -2
        
        for pos in range(self.current_angle, angle, step):
            duty = self._angle_to_duty_cycle(pos)
            self.pwm.ChangeDutyCycle(duty)
            time.sleep(0.01 / speed)
        
        # Final position
        duty = self._angle_to_duty_cycle(angle)
        self.pwm.ChangeDutyCycle(duty)
        time.sleep(0.3)
        
        self.current_angle = angle
        
        # Stop PWM signal to prevent jitter
        self.pwm.ChangeDutyCycle(0)
    
    def cleanup(self):
        """Cleanup GPIO resources"""
        if self.pwm:
            self.pwm.stop()
        GPIO.cleanup()
        logger.info(f"Servo cleanup complete on pin {self.pin}")
    
    def __del__(self):
        """Cleanup on deletion"""
        try:
            self.cleanup()
        except Exception:
            pass


class BinServoController:
    """
    Controls four separate servos, one per bin door:
    - dry
    - wet
    - electronic
    - unknown / multiple / reject
    """
    
    def __init__(
        self,
        dry_pin: int,
        wet_pin: int,
        electronic_pin: int,
        unknown_pin: int,
        frequency: int = 50,
    ):
        self.dry = ServoController(pin=dry_pin, frequency=frequency)
        self.wet = ServoController(pin=wet_pin, frequency=frequency)
        self.electronic = ServoController(pin=electronic_pin, frequency=frequency)
        self.unknown = ServoController(pin=unknown_pin, frequency=frequency)
        
        # Simple open/close angles; you can calibrate these per door
        self.closed_angle = 0
        self.open_angle = 90
        
        # Ensure all doors start closed
        self._close_all()
    
    def _close_all(self):
        for servo in (self.dry, self.wet, self.electronic, self.unknown):
            try:
                servo.rotate_to(self.closed_angle)
            except Exception as e:
                logger.warning(f"Failed to close servo: {e}")
    
    def route_to_bin(self, bin_type: str):
        """
        Open only the door for the given bin type.
        
        Args:
            bin_type: 'dry' | 'wet' | 'electronic' | 'reject' | 'processing'
        """
        logger.info(f"Routing to bin (multi-servo): {bin_type}")
        # Close all doors
        self._close_all()
        
        # Open the appropriate door
        target = None
        if bin_type == 'dry':
            target = self.dry
        elif bin_type == 'wet':
            target = self.wet
        elif bin_type == 'electronic':
            target = self.electronic
        else:
            # reject, processing, unknown, multi-object
            target = self.unknown
        
        try:
            target.rotate_to(self.open_angle)
        except Exception as e:
            logger.error(f"Failed to open door for {bin_type}: {e}")
    
    def reset(self):
        """Close all doors."""
        logger.info("Resetting all bin doors (close)")
        self._close_all()
    
    def cleanup(self):
        """Cleanup all servos."""
        for servo in (self.dry, self.wet, self.electronic, self.unknown):
            try:
                servo.cleanup()
            except Exception:
                pass
