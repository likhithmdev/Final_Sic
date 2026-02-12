"""
GPIO Configuration
Central GPIO pin configuration and initialization
"""

import RPi.GPIO as GPIO
import logging

logger = logging.getLogger(__name__)


class GPIOConfig:
    """Central GPIO configuration manager"""
    
    # Pin definitions (BCM mode)
    # Separate servo pins for each bin door
    SERVO_DRY_PIN = 5
    SERVO_WET_PIN = 6
    SERVO_ELECTRONIC_PIN = 12
    SERVO_UNKNOWN_PIN = 13
    
    # IR sensor
    IR_SENSOR_PIN = 17
    
    # Ultrasonic sensors (Trigger, Echo pairs)
    ULTRASONIC_DRY = (23, 24)
    ULTRASONIC_WET = (25, 8)
    ULTRASONIC_ELECTRONIC = (7, 1)
    ULTRASONIC_PROCESSING = (20, 21)
    
    # LED indicators (optional)
    LED_STATUS = 26
    LED_ERROR = 19
    
    @staticmethod
    def initialize():
        """Initialize GPIO settings"""
        try:
            GPIO.setmode(GPIO.BCM)
            GPIO.setwarnings(False)
            logger.info("GPIO initialized in BCM mode")
        except Exception as e:
            logger.error(f"GPIO initialization failed: {e}")
            raise
    
    @staticmethod
    def cleanup():
        """Cleanup all GPIO resources"""
        try:
            GPIO.cleanup()
            logger.info("GPIO cleanup complete")
        except Exception as e:
            logger.error(f"GPIO cleanup failed: {e}")
    
    @staticmethod
    def get_bin_sensors():
        """
        Get ultrasonic sensor configuration for all bins
        
        Returns:
            Dictionary of bin configurations
        """
        return {
            'dry': (*GPIOConfig.ULTRASONIC_DRY, 30.0),
            'wet': (*GPIOConfig.ULTRASONIC_WET, 30.0),
            'electronic': (*GPIOConfig.ULTRASONIC_ELECTRONIC, 30.0),
            'processing': (*GPIOConfig.ULTRASONIC_PROCESSING, 30.0)
        }
    
    @staticmethod
    def setup_leds():
        """Setup LED indicators"""
        try:
            GPIO.setup(GPIOConfig.LED_STATUS, GPIO.OUT)
            GPIO.setup(GPIOConfig.LED_ERROR, GPIO.OUT)
            
            GPIO.output(GPIOConfig.LED_STATUS, GPIO.LOW)
            GPIO.output(GPIOConfig.LED_ERROR, GPIO.LOW)
            
            logger.info("LED indicators initialized")
        except Exception as e:
            logger.warning(f"LED setup failed: {e}")
    
    @staticmethod
    def set_status_led(state: bool):
        """Set status LED"""
        try:
            GPIO.output(GPIOConfig.LED_STATUS, GPIO.HIGH if state else GPIO.LOW)
        except:
            pass
    
    @staticmethod
    def set_error_led(state: bool):
        """Set error LED"""
        try:
            GPIO.output(GPIOConfig.LED_ERROR, GPIO.HIGH if state else GPIO.LOW)
        except:
            pass
