# 🍓 Raspberry Pi Setup & Usage Guide

Complete guide for setting up and using the Raspberry Pi component of the Smart AI Bin system.

---

## 📋 Table of Contents

1. [Hardware Requirements](#hardware-requirements)
2. [Hardware Connections](#hardware-connections)
3. [Software Setup](#software-setup)
4. [Configuration](#configuration)
5. [Running the System](#running-the-system)
6. [How It Works](#how-it-works)
7. [Integration with Backend](#integration-with-backend)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Hardware Requirements

### Required Components:

| Component | Quantity | Purpose |
|-----------|----------|---------|
| **Raspberry Pi 4** | 1 | Main processing unit (4GB+ RAM recommended) |
| **USB Camera** or **Pi Camera Module** | 1 | Captures images for waste detection |
| **Servo Motor (SG90)** | 1 | Controls sorting mechanism |
| **HC-SR04 Ultrasonic Sensors** | 4 | Monitor bin fill levels |
| **IR Proximity Sensor** | 1 | Detects when waste is placed |
| **LEDs (Optional)** | 2 | Status indicators (green + red) |
| **Breadboard** | 1 | For prototyping |
| **Jumper Wires** | ~20 | Connections |
| **Resistors** | 2-4 | For LED protection (220Ω) |

### Power Requirements:
- **Raspberry Pi**: 5V/3A USB-C power supply
- **Servo**: Can be powered from Pi's 5V rail (if small servo) or external 5V supply
- **Sensors**: Powered from Pi's 3.3V/5V rails

---

## 🔌 Hardware Connections

### GPIO Pin Layout (BCM Mode):

```
┌─────────────────────────────────────┐
│  Raspberry Pi GPIO Pinout (BCM)    │
├─────────────────────────────────────┤
│  Servo Signal      → GPIO 18       │
│  IR Sensor OUT     → GPIO 17       │
│  Status LED        → GPIO 26       │
│  Error LED         → GPIO 19       │
│                                     │
│  Ultrasonic Sensors:                │
│  ┌─────────────────────────────┐   │
│  │ Dry Bin:                    │   │
│  │   Trigger → GPIO 23        │   │
│  │   Echo    → GPIO 24         │   │
│  ├─────────────────────────────┤   │
│  │ Wet Bin:                    │   │
│  │   Trigger → GPIO 25        │   │
│  │   Echo    → GPIO 8          │   │
│  ├─────────────────────────────┤   │
│  │ Electronic Bin:              │   │
│  │   Trigger → GPIO 7          │   │
│  │   Echo    → GPIO 1          │   │
│  ├─────────────────────────────┤   │
│  │ Processing Chamber:          │   │
│  │   Trigger → GPIO 20         │   │
│  │   Echo    → GPIO 21         │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Connection Diagrams:

#### 1. **Servo Motor (SG90)**
```
Servo Motor:
├── Signal (Orange/Yellow) → GPIO 18
├── VCC (Red)              → 5V (Pin 2)
└── GND (Brown/Black)       → GND (Pin 6)
```

#### 2. **IR Proximity Sensor**
```
IR Sensor:
├── OUT → GPIO 17
├── VCC → 5V (Pin 2)
└── GND → GND (Pin 6)
```

#### 3. **Ultrasonic Sensor (HC-SR04) - Example for Dry Bin**
```
HC-SR04:
├── VCC     → 5V (Pin 2)
├── GND     → GND (Pin 6)
├── Trigger → GPIO 23
└── Echo    → GPIO 24 (via voltage divider if needed)
```

**Note:** Echo pin outputs 5V, but Pi GPIO is 3.3V tolerant. Use a voltage divider (2 resistors) or level shifter if needed.

#### 4. **LEDs (Optional)**
```
Status LED (Green):
├── Anode   → GPIO 26 (via 220Ω resistor)
└── Cathode → GND

Error LED (Red):
├── Anode   → GPIO 19 (via 220Ω resistor)
└── Cathode → GND
```

#### 5. **Camera**
- **USB Camera**: Plug into any USB port
- **Pi Camera Module**: Connect to CSI port (cable)

---

## 💻 Software Setup

### Step 1: Install Raspberry Pi OS

1. Download **Raspberry Pi OS** (64-bit recommended)
2. Flash to SD card using **Raspberry Pi Imager**
3. Enable SSH and configure WiFi during setup
4. Boot and update system:

```bash
sudo apt update
sudo apt upgrade -y
```

### Step 2: Enable Camera (if using Pi Camera)

```bash
sudo raspi-config
# Navigate to: Interface Options → Camera → Enable
# Reboot after enabling
```

### Step 3: Install System Dependencies

```bash
# Update package list
sudo apt-get update

# Install Python and build tools
sudo apt-get install -y python3-pip python3-dev python3-venv

# Install OpenCV dependencies
sudo apt-get install -y libopencv-dev python3-opencv

# Install GPIO library dependencies
sudo apt-get install -y python3-rpi.gpio

# Install camera library (for Pi Camera)
sudo apt-get install -y python3-picamera2

# Install other dependencies
sudo apt-get install -y libatlas-base-dev libjpeg-dev libpng-dev
```

### Step 4: Clone/Transfer Project Files

**Option A: If project is on GitHub:**
```bash
cd ~
git clone <your-repo-url>
cd smart-ai-bin
```

**Option B: Transfer files via SCP:**
```bash
# From your computer:
scp -r raspberry-pi/ pi@<raspberry-pi-ip>:~/smart-ai-bin/
```

### Step 5: Install Python Dependencies

```bash
cd ~/smart-ai-bin/raspberry-pi

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip3 install -r requirements.txt
```

**If installation fails, try:**
```bash
# Upgrade pip first
pip3 install --upgrade pip

# Install packages individually if needed
pip3 install ultralytics==8.0.196
pip3 install opencv-python==4.8.1.78
pip3 install numpy==1.24.3
pip3 install paho-mqtt==1.6.1
pip3 install RPi.GPIO==0.7.1
pip3 install picamera2==0.3.12
pip3 install python-dotenv==1.0.0
```

### Step 6: Set GPIO Permissions

```bash
# Add user to gpio group
sudo usermod -a -G gpio $USER

# Logout and login again for changes to take effect
# Or reboot:
sudo reboot
```

---

## ⚙️ Configuration

### Step 1: Create Environment File

```bash
cd ~/smart-ai-bin/raspberry-pi
nano .env
```

### Step 2: Configure Settings

Add the following to `.env`:

```env
# MQTT Broker Settings
MQTT_BROKER=broker.hivemq.com
MQTT_PORT=1883
MQTT_CLIENT_ID=smartbin_pi_001

# YOLO Model Settings
MODEL_PATH=../models/yolo-waste.pt
CONF_THRESHOLD=0.5

# Camera Settings
CAMERA_ID=0
# For Pi Camera Module, use: CAMERA_ID=0
# For USB camera, try: CAMERA_ID=0 or CAMERA_ID=1

# Detection Settings
DETECTION_FPS=5
ENABLE_PREPROCESSING=false

# Bin Settings
BIN_DEPTH=30.0
BIN_FULL_THRESHOLD=80.0

# Servo Settings
SERVO_SPEED=1.0

# System Settings
DEBUG_MODE=false
LOG_LEVEL=INFO
ENVIRONMENT=production

# Monitoring Intervals (seconds)
BIN_STATUS_INTERVAL=30
SYSTEM_STATUS_INTERVAL=60
```

### Step 3: Verify Model File

Ensure your YOLO model file exists:

```bash
# Check if model exists
ls -lh ../models/yolo-waste.pt

# If model doesn't exist, you need to:
# 1. Download a pre-trained model, OR
# 2. Train your own model using the dataset/
```

**To download a pre-trained model:**
```bash
cd ~/smart-ai-bin
mkdir -p models
cd models
# Download your YOLO model file here
# Or train using: python train.py --data ../dataset/data.yaml
```

---

## 🚀 Running the System

### Option 1: Run Directly

```bash
cd ~/smart-ai-bin/raspberry-pi
source venv/bin/activate  # If using virtual environment
python3 main.py
```

**Expected Output:**
```
INFO - Initializing Smart Bin System
INFO - GPIO initialized in BCM mode
INFO - LED indicators initialized
INFO - Loading YOLO model from ../models/yolo-waste.pt
INFO - Model loaded successfully
INFO - Camera initialized: 640x480
INFO - Servo initialized on GPIO pin 18
INFO - IR sensor initialized on GPIO pin 17
INFO - Connected to MQTT broker: broker.hivemq.com:1883
INFO - System initialization complete
INFO - Smart Bin System running - waiting for objects
```

### Option 2: Run as System Service (Auto-start on boot)

Create service file:

```bash
sudo nano /etc/systemd/system/smartbin.service
```

Add content:

```ini
[Unit]
Description=Smart AI Bin System
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/smart-ai-bin/raspberry-pi
Environment="PATH=/home/pi/smart-ai-bin/raspberry-pi/venv/bin"
ExecStart=/home/pi/smart-ai-bin/raspberry-pi/venv/bin/python3 main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable smartbin
sudo systemctl start smartbin

# Check status
sudo systemctl status smartbin

# View logs
sudo journalctl -u smartbin -f
```

---

## 🔄 How It Works

### System Flow:

```
1. IR Sensor detects object
   ↓
2. Camera captures image
   ↓
3. YOLO model processes image
   ↓
4. Detection results analyzed
   ↓
5. Servo rotates to correct bin
   ↓
6. Results published to MQTT
   ↓
7. Backend receives via MQTT
   ↓
8. Dashboard updates in real-time
```

### Detection Logic:

- **0 objects detected** → No action (`destination: "none"`)
- **1 object detected** → Route directly to bin (`destination: "dry"`, `"wet"`, or `"electronic"`)
- **Multiple objects** → Route to processing chamber (`destination: "processing"`)

### Servo Positions:

| Bin Type | Servo Angle | GPIO Pin |
|----------|-------------|----------|
| Processing | 0° | GPIO 18 |
| Dry | 60° | GPIO 18 |
| Wet | 120° | GPIO 18 |
| Electronic | 180° | GPIO 18 |
| Reset/Center | 90° | GPIO 18 |

### MQTT Topics Published:

1. **`smartbin/detection`** - Detection results
   ```json
   {
     "count": 1,
     "objects": [{"class": "dry", "confidence": 0.91}],
     "destination": "dry",
     "timestamp": "2026-02-12T10:30:00"
   }
   ```

2. **`smartbin/bin_status`** - Bin fill levels
   ```json
   {
     "levels": {
       "dry": 45.2,
       "wet": 67.8,
       "electronic": 12.3,
       "processing": 23.1
     },
     "timestamp": "2026-02-12T10:30:00"
   }
   ```

3. **`smartbin/system`** - System status
   ```json
   {
     "status": "ready",
     "message": "System online",
     "timestamp": "2026-02-12T10:30:00"
   }
   ```

---

## 🔗 Integration with Backend

### How Pi Connects to Your Server:

1. **Pi publishes** detection data → MQTT broker (`broker.hivemq.com`)
2. **Backend subscribes** to MQTT topics
3. **Backend receives** data and broadcasts via WebSocket
4. **Frontend dashboard** updates in real-time

### Network Requirements:

- **Raspberry Pi** must have internet connection
- **Backend server** must have internet connection
- Both connect to same MQTT broker (public `broker.hivemq.com` or your own)

### Testing Connection:

**On Raspberry Pi:**
```bash
# Test MQTT publish
mosquitto_pub -h broker.hivemq.com -t "smartbin/test" -m "Hello from Pi"
```

**On your computer (where backend runs):**
```bash
# Test MQTT subscribe
mosquitto_sub -h broker.hivemq.com -t "smartbin/#"
```

If you see messages, connection is working!

---

## 🧪 Testing

### Test 1: GPIO Hardware

```bash
cd ~/smart-ai-bin/raspberry-pi
python3 -c "
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.OUT)
GPIO.output(18, GPIO.HIGH)
print('GPIO 18 set HIGH')
"
```

### Test 2: Camera

```bash
# Test USB camera
python3 -c "
import cv2
cap = cv2.VideoCapture(0)
ret, frame = cap.read()
if ret:
    print('Camera working!')
    cv2.imwrite('test.jpg', frame)
else:
    print('Camera failed')
cap.release()
"
```

### Test 3: YOLO Model

```bash
python3 -c "
from detection.yolo_model import WasteDetector
detector = WasteDetector('../models/yolo-waste.pt')
print('Model loaded successfully!')
"
```

### Test 4: MQTT Connection

```bash
python3 -c "
from mqtt.mqtt_publish import MQTTPublisher
mqtt = MQTTPublisher('broker.hivemq.com', 1883, 'test_client')
mqtt.connect()
mqtt.publish_system_status('test', 'Connection test')
print('MQTT test published!')
mqtt.disconnect()
"
```

### Test 5: Full System Test

1. Place an object near IR sensor
2. System should:
   - Detect object (LED blinks)
   - Capture image
   - Run detection
   - Rotate servo
   - Publish to MQTT
3. Check dashboard for updates

---

## 🔧 Troubleshooting

### Problem: "Permission denied" for GPIO

**Solution:**
```bash
sudo usermod -a -G gpio $USER
# Logout and login again
```

### Problem: Camera not detected

**Solutions:**
```bash
# Check if camera is detected
lsusb | grep -i camera

# Test camera
raspistill -o test.jpg  # For Pi Camera
# OR
python3 -c "import cv2; print(cv2.VideoCapture(0).isOpened())"  # For USB

# Try different camera IDs
# Edit config.py: CAMERA_ID = 0, 1, or 2
```

### Problem: Model file not found

**Solution:**
```bash
# Check if model exists
ls -lh ../models/yolo-waste.pt

# If missing, download or train model
# Update MODEL_PATH in .env or config.py
```

### Problem: MQTT connection failed

**Solutions:**
```bash
# Test internet connection
ping -c 3 broker.hivemq.com

# Test MQTT manually
mosquitto_pub -h broker.hivemq.com -t "test" -m "hello"

# Check firewall (if using custom broker)
sudo ufw allow 1883/tcp
```

### Problem: Servo not moving

**Solutions:**
```bash
# Check wiring (Signal → GPIO 18, VCC → 5V, GND → GND)
# Test servo directly:
python3 -c "
import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.OUT)
pwm = GPIO.PWM(18, 50)
pwm.start(7.5)  # Center position
time.sleep(2)
pwm.stop()
GPIO.cleanup()
"
```

### Problem: Ultrasonic sensors not working

**Solutions:**
- Check wiring (Trigger/Echo pins)
- Verify voltage levels (Echo may need voltage divider)
- Test individually:
```bash
python3 -c "
from hardware.ultrasonic import UltrasonicSensor
sensor = UltrasonicSensor(23, 24, 30.0)
distance = sensor.get_distance()
print(f'Distance: {distance} cm')
"
```

### Problem: High CPU usage

**Solutions:**
- Reduce camera resolution in `config.py`
- Increase `BIN_STATUS_INTERVAL` (check less frequently)
- Use lighter YOLO model (nano instead of medium/large)
- Disable preprocessing: `ENABLE_PREPROCESSING=false`

### Problem: System crashes on startup

**Check logs:**
```bash
# If running as service
sudo journalctl -u smartbin -n 50

# If running directly, check terminal output
python3 main.py 2>&1 | tee log.txt
```

**Common fixes:**
- Ensure all dependencies installed
- Check GPIO permissions
- Verify model file exists
- Test MQTT connection separately

---

## 📊 Monitoring & Logs

### View Real-time Logs

```bash
# If running as service
sudo journalctl -u smartbin -f

# If running directly
tail -f log.txt
```

### Check System Status

```bash
# Check if process is running
ps aux | grep main.py

# Check GPIO state
gpio readall  # If installed

# Check MQTT messages
mosquitto_sub -h broker.hivemq.com -t "smartbin/#" -v
```

---

## 🎯 Next Steps

1. **Train Custom Model**: Use your own waste dataset
2. **Add More Categories**: Extend detection to more waste types
3. **Optimize Performance**: Use TensorRT or ONNX for faster inference
4. **Add Sensors**: Temperature, humidity, air quality
5. **Remote Control**: Add MQTT command subscription for remote control

---

## 📚 Additional Resources

- **Raspberry Pi GPIO Pinout**: https://pinout.xyz/
- **YOLOv8 Documentation**: https://docs.ultralytics.com/
- **MQTT Guide**: https://mqtt.org/
- **OpenCV Python**: https://docs.opencv.org/

---

## ✅ Quick Reference Commands

```bash
# Start system
cd ~/smart-ai-bin/raspberry-pi
python3 main.py

# Stop system
Ctrl+C

# Check status (if service)
sudo systemctl status smartbin

# View logs
sudo journalctl -u smartbin -f

# Test MQTT
mosquitto_sub -h broker.hivemq.com -t "smartbin/#"

# Test camera
raspistill -o test.jpg
```

---

**Your Raspberry Pi is now ready to detect and sort waste! 🎉**

