"""
MQTT Topics Configuration
Centralized topic definitions
"""


class MQTTTopics:
    """MQTT topic definitions"""
    
    # Detection results
    DETECTION = "smartbin/detection"
    
    # Bin fill status
    BIN_STATUS = "smartbin/bin_status"
    
    # System status
    SYSTEM = "smartbin/system"
    
    # Commands (for future remote control)
    COMMANDS = "smartbin/commands"
    
    # Alerts
    ALERTS = "smartbin/alerts"
    
    @staticmethod
    def get_all_topics():
        """Get list of all topics"""
        return [
            MQTTTopics.DETECTION,
            MQTTTopics.BIN_STATUS,
            MQTTTopics.SYSTEM,
            MQTTTopics.COMMANDS,
            MQTTTopics.ALERTS
        ]
