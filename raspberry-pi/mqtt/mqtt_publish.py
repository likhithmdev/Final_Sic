"""
MQTT Publisher
Publishes detection results and sensor data to MQTT broker
"""

import paho.mqtt.client as mqtt
import json
import logging
from datetime import datetime
from typing import Dict, Any

logger = logging.getLogger(__name__)


class MQTTPublisher:
    """Handles MQTT connection and message publishing"""
    
    def __init__(self, broker: str, port: int = 1883, client_id: str = "smartbin_pi"):
        """
        Initialize MQTT publisher
        
        Args:
            broker: MQTT broker address
            port: Broker port
            client_id: Unique client identifier
        """
        self.broker = broker
        self.port = port
        self.client_id = client_id
        self.client = None
        self.connected = False
        
        self._setup_client()
    
    def _setup_client(self):
        """Setup MQTT client and callbacks"""
        try:
            self.client = mqtt.Client(client_id=self.client_id)
            self.client.on_connect = self._on_connect
            self.client.on_disconnect = self._on_disconnect
            
            logger.info(f"MQTT client created: {self.client_id}")
        except Exception as e:
            logger.error(f"MQTT client setup failed: {e}")
            raise
    
    def _on_connect(self, client, userdata, flags, rc):
        """Callback for successful connection"""
        if rc == 0:
            self.connected = True
            logger.info(f"Connected to MQTT broker: {self.broker}:{self.port}")
        else:
            logger.error(f"Connection failed with code {rc}")
    
    def _on_disconnect(self, client, userdata, rc):
        """Callback for disconnection"""
        self.connected = False
        logger.warning(f"Disconnected from MQTT broker (code: {rc})")
    
    def connect(self):
        """Connect to MQTT broker"""
        try:
            logger.info(f"Connecting to {self.broker}:{self.port}")
            self.client.connect(self.broker, self.port, keepalive=60)
            self.client.loop_start()
        except Exception as e:
            logger.error(f"Connection failed: {e}")
            raise
    
    def disconnect(self):
        """Disconnect from broker"""
        if self.client:
            self.client.loop_stop()
            self.client.disconnect()
            logger.info("Disconnected from MQTT broker")
    
    def publish_detection(self, detection_data: Dict[str, Any]):
        """
        Publish detection results
        
        Args:
            detection_data: Detection summary dictionary
        """
        if not self.connected:
            logger.warning("Not connected to broker, skipping publish")
            return
        
        # Add timestamp
        detection_data['timestamp'] = datetime.now().isoformat()
        
        # Publish to detection topic
        topic = "smartbin/detection"
        payload = json.dumps(detection_data)
        
        result = self.client.publish(topic, payload, qos=1)
        
        if result.rc == mqtt.MQTT_ERR_SUCCESS:
            logger.info(f"Published detection: {detection_data['count']} objects → {detection_data['destination']}")
        else:
            logger.error(f"Publish failed with code {result.rc}")
    
    def publish_bin_status(self, bin_levels: Dict[str, float]):
        """
        Publish bin fill levels
        
        Args:
            bin_levels: Dictionary of bin names to fill percentages
        """
        if not self.connected:
            return
        
        payload = json.dumps({
            'levels': bin_levels,
            'timestamp': datetime.now().isoformat()
        })
        
        topic = "smartbin/bin_status"
        self.client.publish(topic, payload, qos=0)
        
        logger.debug(f"Published bin status: {bin_levels}")
    
    def publish_system_status(self, status: str, message: str = ""):
        """
        Publish system status updates
        
        Args:
            status: Status type (ready/processing/error)
            message: Optional status message
        """
        if not self.connected:
            return
        
        payload = json.dumps({
            'status': status,
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
        
        topic = "smartbin/system"
        self.client.publish(topic, payload, qos=0)
        
        logger.info(f"System status: {status} - {message}")
    
    def __del__(self):
        """Cleanup on deletion"""
        self.disconnect()
