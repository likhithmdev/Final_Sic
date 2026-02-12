# Smart AI Waste Segregation System

Edge AI-powered intelligent waste classification system with real-time monitoring dashboard.

## 🎯 Features

- **Real-time Object Detection** using YOLOv8
- **Multi-object Handling** with processing chamber
- **Live Dashboard** with Socket.IO updates
- **Edge AI Processing** on Raspberry Pi
- **Automated Sorting** with servo control
- **Fill-level Monitoring** with ultrasonic sensors
- **🆕 User Authentication** with JWT tokens
- **🆕 Rewards System** - Earn credits by submitting bottles
- **🆕 Redemption Store** - Redeem credits for rewards
- **🆕 Webcam Integration** for bottle verification

## 🏗 Architecture

```
YOLO Detection → MQTT → Node Backend → WebSocket → React Dashboard
     ↓
Hardware Control (Servos, Sensors)
```

## 📦 Components

- **raspberry-pi/** - Edge AI detection & hardware control
- **server/** - Node.js backend with MQTT & WebSocket
- **client/** - React dashboard with real-time updates
- **models/** - Trained YOLO weights
- **dataset/** - Training data
- **docs/** - Documentation & diagrams

## 🚀 Quick Start

### Raspberry Pi Setup
```bash
cd raspberry-pi
pip install -r requirements.txt
python main.py
```

### Server Setup
```bash
cd server
npm install
npm start
```

### Client Setup
```bash
cd client
npm install
npm run dev
```

## 📡 Detection Logic

**Single Object** → Direct to bin (plastic/paper/metal/organic)

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
