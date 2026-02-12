const mqtt = require('mqtt');
const mqttConfig = require('../config/mqtt');

class MQTTService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.messageHandlers = new Map();
  }
  
  connect() {
    console.log(`Connecting to MQTT broker: ${mqttConfig.getBrokerUrl()}`);
    
    this.client = mqtt.connect(mqttConfig.getBrokerUrl(), mqttConfig.options);
    
    this.client.on('connect', () => {
      this.connected = true;
      console.log('✓ Connected to MQTT broker');
      this.subscribeToTopics();
    });
    
    this.client.on('error', (error) => {
      console.error('MQTT Error:', error);
    });
    
    this.client.on('message', (topic, message) => {
      this.handleMessage(topic, message);
    });
    
    this.client.on('disconnect', () => {
      this.connected = false;
      console.log('Disconnected from MQTT broker');
    });
  }
  
  subscribeToTopics() {
    const topics = mqttConfig.getAllTopics();
    
    topics.forEach(topic => {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`Subscribed to: ${topic}`);
        }
      });
    });
  }
  
  handleMessage(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      console.log(`Message received on ${topic}:`, data);
      
      // Call registered handlers
      if (this.messageHandlers.has(topic)) {
        this.messageHandlers.get(topic).forEach(handler => {
          handler(data);
        });
      }
    } catch (error) {
      console.error('Error parsing MQTT message:', error);
    }
  }
  
  onMessage(topic, handler) {
    if (!this.messageHandlers.has(topic)) {
      this.messageHandlers.set(topic, []);
    }
    this.messageHandlers.get(topic).push(handler);
  }
  
  publish(topic, data) {
    if (!this.connected) {
      console.warn('Not connected to MQTT broker');
      return;
    }
    
    const payload = JSON.stringify(data);
    this.client.publish(topic, payload, { qos: 1 }, (err) => {
      if (err) {
        console.error(`Failed to publish to ${topic}:`, err);
      }
    });
  }
  
  disconnect() {
    if (this.client) {
      this.client.end();
      console.log('MQTT client disconnected');
    }
  }
}

module.exports = new MQTTService();
