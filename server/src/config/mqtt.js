const mqtt = require('mqtt');

class MQTTConfig {
  constructor() {
    this.broker = process.env.MQTT_BROKER || 'broker.hivemq.com';
    this.port = parseInt(process.env.MQTT_PORT) || 1883;
    this.clientId = process.env.MQTT_CLIENT_ID || 'smartbin_server';
    
    this.topics = {
      detection: 'smartbin/detection',
      binStatus: 'smartbin/bin_status',
      system: 'smartbin/system',
      commands: 'smartbin/commands',
      alerts: 'smartbin/alerts'
    };
    
    this.options = {
      clientId: this.clientId,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000
    };
  }
  
  getBrokerUrl() {
    return `mqtt://${this.broker}:${this.port}`;
  }
  
  getAllTopics() {
    return Object.values(this.topics);
  }
}

module.exports = new MQTTConfig();
