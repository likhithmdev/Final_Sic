# 🚀 QUICK START - 3-Bin Smart AI System

Get the complete intelligent waste segregation system up and running!

## 📋 Prerequisites

- Raspberry Pi 4 (4GB+) with GPIO pins accessible
- MySQL server (local or remote)
- Node.js 14+ and npm on PC
- Python 3.7+ on Pi and laptop
- USB camera (laptop, for face recognition)
- Internet connection (MQTT broker: broker.hivemq.com)

## ⚡ Quick Setup (5 Steps)

### Step 1: Backend Server (Terminal 1)
```bash
cd server
npm install

# Create .env file:
echo "MQTT_BROKER=broker.hivemq.com
MQTT_PORT=1883
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173" > .env

npm start
```
✅ **Server ready at http://localhost:3000**

### Step 2: Frontend Dashboard (Terminal 2)
```bash
cd client
npm install

# Create .env file:
echo "VITE_SERVER_URL=http://localhost:3000" > .env

npm run dev
```
✅ **Dashboard at http://localhost:5173**
- Create a test account
- Login to see dashboard (empty initially)

### Step 3: MySQL Database
```bash
# Windows:
mysql -u root -p < server\database_setup.sql

# Mac/Linux:
mysql -u root -p < server/database_setup.sql
```
✅ **Database created with all tables**

### Step 4: Face Check-in System (Terminal 3)
```bash
cd laptop

# Install dependencies:
# pip install opencv-python face_recognition numpy requests

# Create training directories:
mkdir -p faces/{sanjay,prekshith,mourya,koushik}

# Add 5-10 clear face photos per user:
# faces/sanjay/photo1.jpg
# faces/sanjay/photo2.jpg
# etc.

# Configure API endpoint if needed:
# Edit face_checkin.py: API_BASE = "http://localhost:3000/api"

python face_checkin.py
```
✅ **Face recognition running**

### Step 5: Raspberry Pi (SSH or Terminal 4)
```bash
# SSH to Pi:
ssh pi@raspberrypi.local

cd [project-path]/raspberry-pi

# Setup:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure (edit config.py):
# - MQTT_BROKER: 'broker.hivemq.com'
# - DETECTOR_TYPE: 'tflite'
# - BIN_DEPTH: 30.0

python main.py
```
✅ **Pi system running, waiting for IR trigger**

## 🟢 Verify Everything is Connected

### In Server Terminal (should print):
```
Connected to MQTT broker
Subscribed to: smartbin/detection
Subscribed to: smartbin/bin_status
Subscribed to: smartbin/system
```

### In Frontend Console (Browser F12):
```
Connected to server
[detectionUpdate] received
[binStatus] received
```

### In Raspberry Pi Terminal:
```
✓ GPIO initialized in BCM mode
✓ Ultrasonic sensor initialized (3 bins)
✓ Connected to MQTT broker
System initialization complete
```

## 🧪 Test the System

### Test 1: Manual Check-in
1. Go to http://localhost:5173
2. Login with created account
3. Go to "💵 Earn Points" page
4. Click "Check in at the bin"
5. See confirmation message & timer
6. Status shows "Checked in" (button changes to "Check Out")

### Test 2: Face Recognition Check-in
1. Position face in front of face_checkin camera
2. Should see terminal output: `[✓] Checked in as [name]`
3. Dashboard updates to show checked in state

### Test 3: Simulate Waste Detection
1. Keep face_checkin and main.py running
2. Put object near IR sensor (or trigger GPIO 17)
3. Pi captures image → detects waste
4. On dashboard, see:
   - Detection card appears
   - Bin fill level updates
   - If dry/e-waste: **points added!**

### Test 4: View Rewards
1. Go to "🎁 Store" page
2. See items and their costs
3. Click "Redeem" on an item
4. Balance decreases by item cost

## 🎬 Complete Workflow

```
┌─ User at Bin ─────────────────────────────────────────┐
│                                                           │
│  1. Face recognized (or manual check-in) ────┐         │
│     ↓                                         │         │
│  2. activeUserStore.setActiveUser(userId)    │         │
│     ↓                                         ▼         │
│  3. Throw waste → IR sensor triggers         Checked  │
│     ↓                                         In ✓     │
│  4. Camera captures image                              │
│     ↓                                                   │
│  5. ML classifies: "dry", "wet", or "electronic"      │
│     ↓                                                   │
│  6. Servo.route_to_bin("dry") → Opens lid            │
│     ↓                                                   │
│  7. MQTT publishes: smartbin/detection                │
│     │                                                   │
│     └─► Server receives                                │
│           - Validates waste type                       │
│           - Gets active user                           │
│           - Credits 5 points (dry) or 10 (e-waste)    │
│           - Updates dashboard                          │
│                                                          │
│  8. User sees points updated in real-time              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 📞 Troubleshooting

| Problem | Fix |
|---------|-----|
| **Server won't start** | Check port 3000 is free, MQTT broker accessible |
| **Dashboard blank** | Check webpack dev server (npm run dev), CORS origin correct |
| **No bin levels** | Check Pi is connected to MQTT, sensors reporting |
| **Points not crediting** | 1) Check user is checked in 2) Check ML confidence >= 0.65 3) Check server logs |
| **Face not recognized** | Add more training photos, try better lighting |
| **Servo doesn't move** | Check 5V power supply, verify GPIO pins in gpio_setup.py |
| **MQTT not working** | Test with: `mosquitto_sub -h broker.hivemq.com -t "smartbin/#"` |
| **Camera not detected** | `python -c "import cv2; print(cv2.VideoCapture(0).isOpened())"` |

## 🔧 Important Config Files

### `raspberry-pi/config.py`
```python
MQTT_BROKER = 'broker.hivemq.com'  # Change if using custom broker
DETECTOR_TYPE = 'tflite'             # Or 'yolo', 'heuristic'
BIN_DEPTH = 30.0                     # cm
CAMERA_ID = 0                        # USB webcam index
DETECTION_FPS = 5                    # Process every 5 FPS
```

### `server/.env`
```
MQTT_BROKER=broker.hivemq.com
DATABASE_HOST=localhost
DATABASE_USER=root
JWT_SECRET=your_secret_key
```

### `client/.env`
```
VITE_SERVER_URL=http://localhost:3000
```

### `laptop/face_checkin.py`
```python
API_BASE = "http://localhost:3000/api"  # Change if server is remote
USER_CREDENTIALS = {
    "sanjay": {"email": "sanjay@01", "password": "123456"},
    # Add more users...
}
```

## 📊 3-Bin System Details

| Bin | Type | Detection Key | Points | Examples |
|-----|------|---------------|--------|----------|
| 1 | **Dry** | `"dry"` | 5 | Plastic, paper, cardboard, metal |
| 2 | **Wet** | `"wet"` | 0 | Food waste, organic, peels |
| 3 | **E-Waste** | `"electronic"` | 10 | Electronics, batteries, hazardous |

Special cases:
- **`"multiplewaste"`**: Multiple items detected → routes to most confident
- **`"reject"`**: Low confidence (<65%) → no reward
- **`"none"`**: No objects detected → no action

## 📚 Documentation

For more detailed information, see:
- [`COMPLETE_SYSTEM_FLOW.md`](COMPLETE_SYSTEM_FLOW.md) - Architecture & workflow
- [`raspberry-pi/HARDWARE_CONNECTIONS.md`](raspberry-pi/HARDWARE_CONNECTIONS.md) - GPIO pins
- [`docs/api-documentation.md`](docs/api-documentation.md) - API reference

## 🎉 You're Done!

The system is now fully operational:

✅ **Server Backend** - Running on port 3000
✅ **Frontend Dashboard** - Running on port 5173  
✅ **Face Recognition** - Auto-checking in users
✅ **Raspberry Pi** - Detecting waste and opening correct bins
✅ **Rewards System** - Auto-crediting points
✅ **MySQL Database** - Storing user data

**Next steps:**
- Train a custom TFLite model with your own waste images
- Add more users for face recognition
- Deploy to production using Docker
- Configure custom MQTT broker
- Set up database backups

---

**Questions?** Check COMPLETE_SYSTEM_FLOW.md or setup logs!
