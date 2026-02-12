# 🚀 QUICK START

Extract the archive and follow these steps:

## 📦 Extract
```bash
tar -xzf smart-ai-bin.tar.gz
cd smart-ai-bin
```

## 🔧 Setup & Run

### 1️⃣ Server (Terminal 1)
```bash
cd server
npm install
npm start
```
Server runs on http://localhost:3000

### 2️⃣ Client (Terminal 2)
```bash
cd client
npm install
npm run dev
```
Dashboard runs on http://localhost:5173

Access the app at http://localhost:5173
- Sign up/Login to create account
- Dashboard: Main waste monitoring
- Redeem Points: Submit bottles for credits
- Store: Redeem credits for rewards

### 3️⃣ MySQL Database (Required for Rewards)
```bash
# Start MySQL
sudo systemctl start mysql

# Create database (auto-creates on first run)
# Or manually: mysql -u root -p < server/database_setup.sql
```

Configure in `server/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smartbin_db
```

### 4️⃣ Raspberry Pi (Terminal 3)
```bash
cd raspberry-pi
pip install -r requirements.txt
python main.py
```

## 📁 Project Structure
```
smart-ai-bin/
├── raspberry-pi/     # Edge AI + Hardware Control
│   ├── detection/    # YOLO model & inference
│   ├── hardware/     # Servo, sensors, GPIO
│   └── mqtt/         # MQTT publishing
│
├── server/           # Node.js Backend
│   └── src/
│       ├── services/ # MQTT & WebSocket
│       ├── routes/   # REST API
│       └── config/   # Configuration
│
├── client/           # React Dashboard
│   └── src/
│       ├── components/ # UI components
│       ├── pages/      # Dashboard page
│       └── context/    # Socket context
│
├── models/           # YOLO weights
├── dataset/          # Training data
├── docs/             # Documentation
└── docker/           # Docker setup
```

## 🎯 Key Features

✅ Real-time YOLO detection
✅ Multi-object smart routing
✅ Live WebSocket dashboard
✅ MQTT IoT communication
✅ Bin fill monitoring
✅ Processing chamber logic
✅ Animated UI with stats
✅ 🆕 User authentication & login
✅ 🆕 Bottle submission rewards (100 credits/bottle)
✅ 🆕 Webcam integration
✅ 🆕 Redemption store with 12+ items
✅ 🆕 MySQL database for user data

## 📊 Detection Logic

**Single Object** → Direct to bin (dry/wet/electronic)
**Multiple Objects** → Processing chamber → Sequential sorting

## 🔌 MQTT Topics

- `smartbin/detection` - Detection results
- `smartbin/bin_status` - Fill levels
- `smartbin/system` - System status

## 🌐 API Endpoints

- `GET /api/stats` - Statistics
- `GET /api/history` - Detection history
- `GET /api/health` - Health check

## 📱 Dashboard Features

- Live camera feed visualization
- Real-time detection display
- Bin status with fill levels
- Processing chamber monitor
- Analytics & statistics

## 🐳 Docker Deploy (Optional)

```bash
cd docker
docker-compose up -d
```

## ⚙️ Configuration

Edit `.env` files in each folder:
- `raspberry-pi/.env` - MQTT broker, model path
- `server/.env` - Server port, MQTT settings
- `client/.env` - Server URL

## 📚 Documentation

- `docs/architecture-diagram.md` - System architecture
- `docs/api-documentation.md` - API reference
- `docs/setup-guide.md` - Detailed setup

## 🎓 Tech Stack

**Edge AI**: Python, YOLOv8, OpenCV, RPi.GPIO
**Backend**: Node.js, Express, MQTT, Socket.IO
**Frontend**: React, Tailwind CSS, Framer Motion
**Hardware**: Raspberry Pi, Servos, Sensors

---

Built with 🧠 Edge AI + 🌐 IoT + ⚡ Real-time Dashboard
