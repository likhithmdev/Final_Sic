"""
MQ135 Air Quality Sensor Module
Uses ADS1115 16-bit ADC for precise analog readings
"""

import time
import logging
import math

try:
    import board
    import busio
    import adafruit_ads1x15.ads1115 as ADS
    from adafruit_ads1x15.analog_in import AnalogIn
    ADS_AVAILABLE = True
except ImportError:
    ADS_AVAILABLE = False
    logging.warning("ADS1115 library not available. Install: pip3 install adafruit-circuitpython-ads1x15")

from hardware.gpio_setup import GPIOConfig

logger = logging.getLogger(__name__)


class MQ135Sensor:
    """
    MQ135 Air Quality Sensor
    Detects: CO2, NH3, NOx, Alcohol, Benzene, Smoke
    """
    
    def __init__(self, channel=0, i2c_address=0x48):
        """
        Initialize MQ135 sensor with ADS1115 ADC
        
        Args:
            channel: ADS1115 channel (0-3)
            i2c_address: I2C address of ADS1115
        """
        self.channel = channel
        self.i2c_address = i2c_address
        self.adc = None
        self.sensor_input = None
        
        # Calibration parameters
        self.R0 = 10.0  # Sensor resistance in clean air (calibrate this!)
        self.RL = 10.0  # Load resistance in kOhms
        
        # Gas constants for PPM calculation
        self.PARA = 116.6020682
        self.PARB = 2.769034857
        
        # Thresholds
        self.GOOD_AIR_THRESHOLD = 400    # PPM
        self.MODERATE_THRESHOLD = 1000   # PPM
        self.POOR_THRESHOLD = 2000       # PPM
        
        if not ADS_AVAILABLE:
            logger.error("ADS1115 library not installed!")
            return
        
        try:
            # Initialize I2C and ADS1115
            i2c = busio.I2C(board.SCL, board.SDA)
            self.adc = ADS.ADS1115(i2c, address=self.i2c_address)
            
            # Create analog input on specified channel
            if channel == 0:
                self.sensor_input = AnalogIn(self.adc, ADS.P0)
            elif channel == 1:
                self.sensor_input = AnalogIn(self.adc, ADS.P1)
            elif channel == 2:
                self.sensor_input = AnalogIn(self.adc, ADS.P2)
            elif channel == 3:
                self.sensor_input = AnalogIn(self.adc, ADS.P3)
            
            logger.info(f"✓ MQ135 initialized on ADS1115 channel {channel}")
            logger.info("⏳ Warming up sensor (30 seconds recommended)")
            
        except Exception as e:
            logger.error(f"Failed to initialize MQ135: {e}")
            self.adc = None
    
    def read_voltage(self):
        """
        Read raw voltage from sensor
        
        Returns:
            Voltage in volts
        """
        if self.sensor_input is None:
            return 0.0
        
        try:
            voltage = self.sensor_input.voltage
            return voltage
        except Exception as e:
            logger.error(f"Voltage read error: {e}")
            return 0.0
    
    def read_value(self):
        """
        Read raw ADC value
        
        Returns:
            Raw 16-bit ADC value
        """
        if self.sensor_input is None:
            return 0
        
        try:
            value = self.sensor_input.value
            return value
        except Exception as e:
            logger.error(f"ADC read error: {e}")
            return 0
    
    def get_resistance(self):
        """
        Calculate sensor resistance
        
        Returns:
            Sensor resistance in kOhms
        """
        voltage = self.read_voltage()
        
        if voltage == 0:
            return float('inf')
        
        # Calculate sensor resistance
        # RS = [(VC/VRL) - 1] * RL
        VCC = 3.3  # Supply voltage
        RS = ((VCC / voltage) - 1) * self.RL
        
        return RS
    
    def get_ppm(self):
        """
        Get CO2 concentration in PPM
        
        Returns:
            CO2 concentration in parts per million
        """
        rs = self.get_resistance()
        
        if rs == float('inf') or self.R0 == 0:
            return 0.0
        
        # Calculate ratio
        ratio = rs / self.R0
        
        # Calculate PPM using exponential equation
        # ppm = PARA * ratio ^ (-PARB)
        try:
            ppm = self.PARA * math.pow(ratio, -self.PARB)
            return round(ppm, 2)
        except Exception as e:
            logger.error(f"PPM calculation error: {e}")
            return 0.0
    
    def calibrate(self, samples=50):
        """
        Calibrate sensor in clean air
        Sets R0 value for PPM calculations
        
        Args:
            samples: Number of samples to average
        """
        logger.info(f"Calibrating MQ135 with {samples} samples...")
        logger.info("Ensure sensor is in CLEAN AIR!")
        
        resistances = []
        
        for i in range(samples):
            rs = self.get_resistance()
            if rs != float('inf'):
                resistances.append(rs)
            time.sleep(0.5)
            
            if (i + 1) % 10 == 0:
                logger.info(f"Progress: {i+1}/{samples}")
        
        if resistances:
            self.R0 = sum(resistances) / len(resistances)
            logger.info(f"✓ Calibration complete: R0 = {self.R0:.2f} kΩ")
            logger.info(f"Add this to config: R0 = {self.R0:.2f}")
        else:
            logger.error("Calibration failed - no valid readings")
    
    def get_air_quality(self):
        """
        Get air quality assessment
        
        Returns:
            Dict with PPM and quality rating
        """
        ppm = self.get_ppm()
        voltage = self.read_voltage()
        
        # Determine quality
        if ppm < self.GOOD_AIR_THRESHOLD:
            quality = "Good"
            emoji = "🟢"
        elif ppm < self.MODERATE_THRESHOLD:
            quality = "Moderate"
            emoji = "🟡"
        elif ppm < self.POOR_THRESHOLD:
            quality = "Poor"
            emoji = "🟠"
        else:
            quality = "Hazardous"
            emoji = "🔴"
        
        return {
            'ppm': ppm,
            'quality': quality,
            'emoji': emoji,
            'voltage': voltage,
            'good': ppm < self.GOOD_AIR_THRESHOLD
        }
    
    def monitor_air_quality(self, duration=60, interval=5):
        """
        Monitor air quality for specified duration
        
        Args:
            duration: Total monitoring time in seconds
            interval: Measurement interval in seconds
        """
        logger.info(f"Monitoring air quality for {duration} seconds...")
        
        start_time = time.time()
        measurements = []
        
        while time.time() - start_time < duration:
            quality = self.get_air_quality()
            measurements.append(quality['ppm'])
            
            print(f"\n{quality['emoji']} Air Quality: {quality['quality']}")
            print(f"   CO2: {quality['ppm']:.2f} PPM")
            print(f"   Voltage: {quality['voltage']:.3f}V")
            
            time.sleep(interval)
        
        # Summary
        if measurements:
            avg_ppm = sum(measurements) / len(measurements)
            max_ppm = max(measurements)
            min_ppm = min(measurements)
            
            print("\n📊 Summary:")
            print(f"   Average: {avg_ppm:.2f} PPM")
            print(f"   Maximum: {max_ppm:.2f} PPM")
            print(f"   Minimum: {min_ppm:.2f} PPM")
    
    def is_hazardous_gas_detected(self, threshold=None):
        """
        Check if hazardous gas levels detected
        
        Args:
            threshold: PPM threshold (uses POOR_THRESHOLD if None)
            
        Returns:
            True if hazardous levels detected
        """
        if threshold is None:
            threshold = self.POOR_THRESHOLD
        
        ppm = self.get_ppm()
        is_hazardous = ppm >= threshold
        
        if is_hazardous:
            logger.warning(f"⚠️ Hazardous gas detected: {ppm:.2f} PPM")
        
        return is_hazardous


class AirQualityMonitor:
    """Continuous air quality monitoring for Smart Bin"""
    
    def __init__(self):
        """Initialize air quality monitor"""
        self.sensor = MQ135Sensor(
            channel=GPIOConfig.MQ135_CHANNEL,
            i2c_address=GPIOConfig.ADS1115_I2C_ADDRESS
        )
        self.alert_threshold = 1500  # PPM
        self.last_alert_time = 0
        self.alert_cooldown = 300  # 5 minutes between alerts
        
        logger.info("✓ Air quality monitor initialized")
    
    def check_and_alert(self):
        """
        Check air quality and return alert if needed
        
        Returns:
            Dict with alert info, or None if no alert
        """
        quality = self.sensor.get_air_quality()
        
        # Check if alert needed
        if quality['ppm'] >= self.alert_threshold:
            current_time = time.time()
            
            # Respect cooldown period
            if current_time - self.last_alert_time >= self.alert_cooldown:
                self.last_alert_time = current_time
                
                return {
                    'type': 'air_quality',
                    'severity': 'warning' if quality['ppm'] < 2000 else 'critical',
                    'ppm': quality['ppm'],
                    'quality': quality['quality'],
                    'message': f"Poor air quality detected: {quality['ppm']:.0f} PPM"
                }
        
        return None
    
    def get_status(self):
        """Get current air quality status"""
        return self.sensor.get_air_quality()
