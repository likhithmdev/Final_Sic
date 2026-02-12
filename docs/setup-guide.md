# Setup Guide

## Prerequisites

### Hardware
- Raspberry Pi 4 (4GB+ recommended)
- USB Camera or Pi Camera Module
- Servo Motor (SG90 or similar)
- HC-SR04 Ultrasonic Sensors (5x)
- IR Proximity Sensor
- Jumper wires and breadboard

### Software
- Python 3.8+
- Node.js 18+
- npm or yarn

## Installation Steps

### 1. Raspberry Pi Setup

```bash
cd raspberry-pi

# Install system dependencies
sudo apt-get update
sudo apt-get install python3-pip python3-opencv libatlas-base-dev

# Install Python packages
pip3 install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MQTT broker details
```

### 2. Server Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with:
# - MQTT_BROKER address
# - PORT number
# - CORS_ORIGIN

# Start server
npm start
# or for development
npm run dev
```

### 3. Client Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# For production build
npm run build
npm run preview
```

### 4. Model Setup

Download pre-trained YOLO model or train your own:

```bash
# Place your model file in models/
models/
  └── yolo-waste.pt

# Or train custom model:
python train_model.py --data dataset/data.yaml --epochs 100
```

## Hardware Connections

### Servo Motor
- Signal → GPIO 18
- VCC → 5V
- GND → GND

### IR Sensor
- OUT → GPIO 17
- VCC → 5V
- GND → GND

### Ultrasonic Sensors
```
Dry Bin:        Trigger → GPIO 23, Echo → GPIO 24
Wet Bin:        Trigger → GPIO 25, Echo → GPIO 8
Electronic Bin: Trigger → GPIO 7,  Echo → GPIO 1
Processing:     Trigger → GPIO 20, Echo → GPIO 21
```

## Running the System

### Option 1: Manual Start

Terminal 1 (Server):
```bash
cd server
npm start
```

Terminal 2 (Client):
```bash
cd client
npm run dev
```

Terminal 3 (Raspberry Pi):
```bash
cd raspberry-pi
python3 main.py
```

### Option 2: Docker

```bash
cd docker
docker-compose up -d
```

## Testing

### Test MQTT Connection
```bash
# Subscribe to topics
mosquitto_sub -h localhost -t "smartbin/#"

# Publish test message
mosquitto_pub -h localhost -t "smartbin/detection" -m '{"count":1,"objects":[{"class":"dry","confidence":0.9}],"destination":"dry","timestamp":"2026-02-11T12:00:00Z"}'
```

### Test API
```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/stats
```

### Test WebSocket
Open browser console and run:
```javascript
const socket = io('http://localhost:3000');
socket.on('connect', () => console.log('Connected'));
socket.on('detectionUpdate', (data) => console.log('Detection:', data));
```

## Troubleshooting

### MQTT Not Connecting
- Check broker address in .env files
- Ensure MQTT broker is running
- Check firewall settings

### Camera Not Working
- Verify camera is enabled: `sudo raspi-config`
- Check camera permissions
- Test with: `raspistill -o test.jpg`

### GPIO Permission Errors
```bash
sudo usermod -a -G gpio $USER
# Logout and login again
```

### Model Loading Fails
- Ensure model file exists in models/
- Check model path in config.py
- Verify ultralytics installation

## Environment Variables

### Raspberry Pi (.env)
```
MQTT_BROKER=broker.hivemq.com
MQTT_PORT=1883
MODEL_PATH=../models/yolo-waste.pt
CAMERA_ID=0
```

### Server (.env)
```
PORT=3000
MQTT_BROKER=broker.hivemq.com
MQTT_PORT=1883
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Client (.env)
```
VITE_SERVER_URL=http://localhost:3000
```

## Production Deployment

1. Use production MQTT broker
2. Set NODE_ENV=production
3. Build client: `npm run build`
4. Use reverse proxy (nginx)
5. Enable HTTPS
6. Set up monitoring

## Next Steps

- Train custom YOLO model with your waste dataset
- Add more waste categories
- Implement database for long-term analytics
- Add mobile app support
- Implement user authentication
