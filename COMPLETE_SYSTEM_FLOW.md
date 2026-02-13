# Smart AI Bin - Complete System Flow

## 🎯 Overview

The Smart AI Bin is an intelligent waste segregation and rewards system with 3 waste categories:
- **Dry Waste** (5 points) - Plastics, paper, cardboard
- **Wet Waste** (0 points) - Organic waste
- **E-Waste** (10 points) - Electronic items

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Smart AI Bin System                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐       ┌──────────────────┐                 │
│  │  Raspberry Pi    │       │   Laptop/PC      │                 │
│  │  (Hardware)      │       │  (Check-in)      │                 │
│  │                  │       │                  │                 │
│  │ • IR Sensor      │◄──────┤ Face Cam (USB)   │                 │
│  │ • Camera         │       │                  │                 │
│  │ • 3x Servos      │       │ Face Recognition │                 │
│  │ • 3x Ultrasonic  │       │ Auto Check-in    │                 │
│  │ • ML Model       │       └──────────────────┘                 │
│  │                  │                                             │
│  │ main.py          │                                             │
│  │ (Always running) │                                             │
│  └────────┬─────────┘                                             │
│           │                                                       │
│           │ MQTT Topics:                                         │
│           ├──► smartbin/detection  (waste type detected)        │
│           ├──► smartbin/bin_status (fill levels)                │
│           └──► smartbin/system     (status updates)              │
│           │                                                       │
│  ┌────────▼──────────────────────────────────────────────────┐   │
│  │         MQTT Broker (broker.hivemq.com)                    │   │
│  └────────┬───────────────────────────────────────────────────┘   │
│           │                                                       │
│  ┌────────▼─────────────────┐     ┌──────────────────────────┐   │
│  │  Backend Server          │     │  Frontend (React)        │   │
│  │  (Node.js)               │     │  (Vite)                  │   │
│  │                          │     │                          │   │
│  │ • Express API           ◄────►│ • Dashboard              │   │
│  │ • Socket.IO             │     │ • Rewards Page           │   │
│  │ • MQTT Handler          │     │ • Store/Redeem           │   │
│  │ • MySQL Database        │     │ • Login/Register         │   │
│  │ • Auth System           │     │                          │   │
│  │ • Rewards System        │     │ Real-time Updates via    │   │
│  │                         │     │ Socket.IO                │   │
│  └─────────────────────────┘     └──────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Complete Workflow

### Phase 1: User Check-in
1. **Laptop Face Check-in** (`laptop/face_checkin.py`)
   - USB camera scans for recognized faces
   - Face matched against known user encodings
   - Automatically logs in recognized user via `/api/auth/login`
   - Calls `/api/rewards/check-in` to mark user as active

2. **OR Manual Check-in** (via Website)
   - User logs into dashboard
   - User clicks "Check in at the bin" button on `/redeem-points` page
   - User becomes active (eligible for auto-credits)

### Phase 2: Waste Detection & Routing
1. **Raspberry Pi Main Process** (`raspberry-pi/main.py`)
   - Continuously running and waiting for IR sensor trigger
   - IR sensor detects presence of waste
   
2. **Image Capture & Processing**
   - Pi camera captures frame
   - Image preprocessed (resized, enhanced)
   - ML model processes image → classifies waste
   
3. **ML Classification Options**
   - **TFLite Model** (recommended, lightweight) - Teachable Machine trained model
   - **YOLO Model** (heavier) - YOLOv8 object detection
   - **Heuristic Model** (fallback) - OpenCV-based color/edge analysis
   
4. **Classification Results**
   - Single object: routes to that waste type ('dry', 'wet', 'electronic')
   - Multiple objects: routes to 'multiplewaste' (or most confident detection)
   - Low confidence (<65%): routes to 'reject' (no reward)
   - No objects: 'none' (no action)

### Phase 3: Servo Control & Lid Opening
1. **Route to Bin**
   - Server determines destination from detection
   - BinServoController.route_to_bin(destination)
   - Corresponding servo motor rotates to open lid (90°)
   
2. **Waste Disposal**
   - Waste falls into correct bin
   - Motor waits 2 seconds
   - Motor rotates back to close lid (0°)

### Phase 4: Sensor Reporting
1. **Bin Level Monitoring**
   - All 3 ultrasonic sensors continuously measure fill level
   - HC-SR04 sensors measure distance (converted to fill percentage)
   - Run every BIN_STATUS_INTERVAL (default: 30 seconds)
   
2. **MQTT Publication**
   ```json
   Topic: smartbin/bin_status
   Payload: {
     "levels": {
       "dry": 45.5,
       "wet": 62.3,
       "electronic": 28.7
     },
     "timestamp": "2026-02-13T10:30:45.123Z"
   }
   ```
   
3. **Frontend Display**
   - Real-time bin levels shown on Dashboard
   - Visual fill indicators
   - Alerts when bin reaches 80% capacity

### Phase 5: Detection Publishing & Rewards
1. **MQTT Detection Publication** (from Pi)
   ```json
   Topic: smartbin/detection
   Payload: {
     "count": 1,
     "objects": [
       {
         "class": "dry",
         "confidence": 0.87
       }
     ],
     "destination": "dry",
     "timestamp": "2026-02-13T10:30:45.123Z"
   }
   ```

2. **Server Reception & Validation**
   - Server receives MQTT message on `smartbin/detection` topic
   - Validates waste type is one of: 'dry', 'wet', 'electronic'
   - Checks confidence threshold (>= 0.65)
   - Confirms user is checked in via activeUserStore

3. **Automatic Point Credit**
   ```javascript
   // If conditions met:
   // - User is checked in
   // - Waste type is 'dry' or 'electronic'
   // - Confidence >= 0.65
   // - Destination != 'reject'
   
   // Then credit user:
   Dry waste: +5 points
   Electronic waste: +10 points
   Other: no points
   ```

4. **Database Update**
   - Insert into `bottle_submissions` table
   - Update `users` table: credits, bottles_submitted, total_earned
   - Transaction ensures data consistency

5. **Real-time Frontend Update**
   - Socket.IO emits `creditUpdate` event
   - User's dashboard updates instantly
   - Points total displayed in header
   - Visual feedback (animation, notification)

## 🔌 MQTT Topics Reference

| Topic | Direction | Purpose | Frequency |
|-------|-----------|---------|-----------|
| `smartbin/detection` | Pi → Server | Waste detected, type, confidence | Event-based |
| `smartbin/bin_status` | Pi → Server | Fill levels of 3 bins | Every 30s |
| `smartbin/system` | Pi → Server | System status (ready/error) | Event-based |
| `smartbin/alerts` | Pi → Server | Alerts (bin full, errors) | Event-based |
| `smartbin/commands` | Server → Pi | Remote commands (reserved) | On-demand |

## 📊 Points System

| Waste Type | Points | Reason |
|-----------|--------|--------|
| Dry (Plastic/Paper) | 5 | Recyclable, less valuable |
| Wet (Organic) | 0 | Biodegradable, not rewarded |
| E-Waste | 10 | Hazardous, high value |

## 🔐 Authentication Flow

```
1. User Login
   POST /api/auth/login
   Request: { email, password }
   Response: { token, user }

2. Check-in Endpoint
   POST /api/rewards/check-in
   Header: Authorization: Bearer {token}
   Side Effect: activeUserStore.setActiveUser(userId)

3. MQTT Auto-Credit
   - Checks activeUserStore.getActiveUser()
   - Credits user if logged in and waste detected

4. Check-out Endpoint
   POST /api/rewards/check-out
   Side Effect: activeUserStore.clearActiveUser()
```

## 🗄️ Database Schema

### Key Tables
- **users**: Email, password, credits, bottles_submitted, total_earned
- **bottle_submissions**: When and how much each user earned
- **redemptions**: What rewards user has exchanged
- **detection_logs**: History of all waste detections

## 🛠️ Setup Instructions

### On Raspberry Pi
```bash
1. SSH into Pi and navigate to project
2. cd raspberry-pi

3. Create virtual environment
   python3 -m venv venv
   source venv/bin/activate

4. Install dependencies
   pip install -r requirements.txt

5. Configure settings
   # Edit config.py:
   - MQTT_BROKER: Your broker address
   - DETECTOR_TYPE: 'tflite' (recommended)
   - BIN_DEPTH: 30cm (adjust for your bins)

6. Run main system
   python main.py
   # System will wait for IR sensor trigger
```

### On Laptop/PC (Face Check-in)
```bash
1. Install requirements
   pip install opencv-python face_recognition numpy requests

2. Create training data
   mkdir -p faces/{sanjay,prekshith,mourya,koushik}
   # Add 5-10 clear face photos per user to each folder

3. Configure API endpoint
   # Edit face_checkin.py:
   API_BASE = "http://localhost:3000/api"  # Change if server is remote
   USER_CREDENTIALS = { ... }  # Update with actual credentials

4. Run face check-in
   python face_checkin.py
   # Keep running while bin is in use
```

### On PC (Backend Server)
```bash
1. cd server
   npm install

2. Configure environment
   # Create .env file:
   MQTT_BROKER=broker.hivemq.com
   MQTT_PORT=1883
   DATABASE_HOST=localhost
   DATABASE_USER=root
   DATABASE_PASSWORD=yourpassword
   JWT_SECRET=your_secret_key

3. Start server
   npm start
   # Listens on port 3000
```

### On PC (Frontend)
```bash
1. cd client
   npm install

2. Configure API endpoint
   # Create .env file:
   VITE_SERVER_URL=http://localhost:3000

3. Start development server
   npm run dev
   # Opens at http://localhost:5173
```

## 📱 User Experience Flow

### For End Users
1. **At Check-in**
   - Face recognized automatically OR
   - Manually click "Check in" button on website
   - See "Checked in" status with countdown timer

2. **At Waste Disposal**
   - Throw waste into bin → IR sensor triggers
   - System captures image → classifies waste
   - Servo opens correct lid automatically
   - Waste falls into proper bin
   - Dashboard updates in real-time with points earned

3. **In Dashboard**
   - See live bin fill levels
   - See detection history
   - See points earned
   - Confirmed via check-in status indicator

4. **At Rewards Store**
   - Browse rewards catalog
   - Redeem points for prizes
   - View redemption history

## 🔧 Troubleshooting

### IR Sensor not triggering
- Check GPIO pin (default: GPIO 17)
- Verify sensor powered (3.3V or 5V)
- Test with: `python -c "import RPi.GPIO as GPIO; print(GPIO.input(17))"`

### Camera not capturing
- Check USB connection or Pi Camera ribbon cable
- Run: `python -c "import cv2; print(cv2.VideoCapture(0).isOpened())"`
- Try different CAMERA_ID in config.py

### Servo not opening lid
- Verify servo PWM pins (5, 6, 12)
- Check 5V power supply (servos draw 1A total)
- Test servo: `python -c "from hardware.servo_control import BinServoController; ..."`

### No MQTT messages
- Check broker connectivity: `mosquitto_sub -h broker.hivemq.com -t "smartbin/#"`
- Verify MQTT_BROKER in config.py
- Check firewall (port 1883)

### Points not crediting
- Verify user is checked in (check activeUserStore)
- Check server logs for MQTT message reception
- Verify confidence >= 0.65
- Check database user credits updated

## 📞 Support

For issues or questions, check logs:
- **Pi**: `python main.py` (stdout logs)
- **Server**: `npm start` (console logs)
- **Frontend**: Browser console (F12)
- **MQTT**: `mosquitto_sub -h broker.hivemq.com -t "smartbin/#"`

