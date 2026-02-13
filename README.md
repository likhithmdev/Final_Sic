# Smart AI Waste Segregation System

AI-powered intelligent waste classification system with 3-bin segregation, real-time monitoring, and rewards system.

## 🎯 Features

- **Smart 3-Bin Segregation**: Dry, Wet, and E-Waste
- **Real-time Detection** using TFLite/YOLO/Heuristic models
- **Face Recognition Check-in** on laptop
- **Servo-Controlled Lids** for automatic sorting
- **Fill-level Monitoring** with 3 ultrasonic sensors
- **User Authentication** with JWT tokens
- **Rewards System** - Earn points for dry & e-waste
- **Store & Redemption** - Redeem points for rewards
- **Live Dashboard** with Socket.IO real-time updates
- **MQTT Integration** for reliable communication

## 🗑️ Waste Categories (3 Bins)

| Bin | Type | Points |
|-----|------|--------|
| 1 | **Dry** (Plastic, Paper, Cardboard) | 5 |
| 2 | **Wet** (Organic, Food Waste) | 0 |
| 3 | **E-Waste** (Electronics, Hazardous) | 10 |

## 🏗 Architecture

```
IR Sensor Trigger → Camera Capture → ML Detection → Servo Control
         ↓
   MQTT Publishing → Backend Server → Real-time Updates → Dashboard
         ↓
   Auto-Credit Rewards → Bin Level Monitoring
```

## 📦 Components

- **raspberry-pi/** - Edge AI inference & hardware control (main.py)
- **laptop/** - Face recognition check-in system (face_checkin.py)
- **server/** - Node.js backend with MQTT, WebSocket, MySQL
- **client/** - React dashboard with live updates
- **models/** - TFLite/YOLO model weights
- **docs/** - Architecture & setup guides

## 🚀 Quick Start

### 1. Raspberry Pi (Hardware & Detection)
```bash
cd raspberry-pi
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```
- Waits for IR sensor trigger
- Captures image and runs ML detection
- Controls servos to open correct bin lid
- Publishes detection & bin status via MQTT

### 2. Backend Server (Node.js)
```bash
cd server
npm install
npm start
```
- Connects to MQTT broker
- Receives detections and bin status
- Auto-credits users for waste disposal
- Serves API endpoints

### 3. Frontend Client (React)
```bash
cd client
npm install
npm run dev
```
- Displays real-time dashboard
- Shows bin fill levels & detection history
- User login & rewards management

### 4. Face Check-in (Optional, on Laptop)
```bash
cd laptop
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Add training images to faces/{username}/ directories
# Then run:
python face_checkin.py
```
- Recognizes users automatically
- Auto-checks them into the system
- Enables instant point credits

**Multiple Objects** → Processing chamber → Sequential segregation

## 🎨 Tech Stack

- **Edge AI**: YOLOv8, OpenCV, Python
- **Backend**: Node.js, Express, MQTT, Socket.IO
- **Frontend**: React, Tailwind CSS, Framer Motion
- **Hardware**: Raspberry Pi, Servos, Ultrasonic sensors

## 📊 Detection JSON Format

```json
{
  "count": 2,
  "objects": [
    {"class": "plastic", "confidence": 0.91},
    {"class": "metal", "confidence": 0.85}
  ],
  "destination": "processing",
  "timestamp": "2026-02-11T12:00:00"
}
```

## 🔧 Configuration

Edit `raspberry-pi/config.py` and `server/.env` for MQTT broker settings.

## 📄 License

MIT License - Built for innovation

---

**Not just a smart bin. A complete IoT AI system.**
