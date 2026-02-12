# 🍓 Raspberry Pi Setup Guide - Windows Edition

Complete guide for Windows users to set up and manage the Raspberry Pi component of the Smart AI Bin system.

---

## 📋 Table of Contents

1. [Prerequisites (Windows)](#prerequisites-windows)
2. [Initial Raspberry Pi Setup](#initial-raspberry-pi-setup)
3. [Transfer Files from Windows to Pi](#transfer-files-from-windows-to-pi)
4. [Connect to Raspberry Pi from Windows](#connect-to-raspberry-pi-from-windows)
5. [Install Software on Raspberry Pi](#install-software-on-raspberry-pi)
6. [Configure from Windows](#configure-from-windows)
7. [Run and Monitor from Windows](#run-and-monitor-from-windows)
8. [Testing from Windows](#testing-from-windows)
9. [Troubleshooting](#troubleshooting)

---

## 🪟 Prerequisites (Windows)

### Required Windows Software:

| Software | Purpose | Download Link |
|----------|---------|--------------|
| **Raspberry Pi Imager** | Flash OS to SD card | https://www.raspberrypi.com/software/ |
| **PuTTY** or **Windows Terminal** | SSH to Raspberry Pi | PuTTY: https://www.putty.org/ |
| **WinSCP** or **FileZilla** | Transfer files to Pi | WinSCP: https://winscp.net/ |
| **Notepad++** or **VS Code** | Edit config files | VS Code: https://code.visualstudio.com/ |

### Install Required Tools:

**Option 1: Using PowerShell (Recommended)**
```powershell
# Install Windows Terminal (if not installed)
winget install Microsoft.WindowsTerminal

# Install OpenSSH Client (for SSH)
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0

# Install SCP (comes with OpenSSH)
# Already included with OpenSSH Client
```

**Option 2: Manual Installation**
1. Download **Raspberry Pi Imager** from official site
2. Download **PuTTY** or use built-in Windows Terminal
3. Download **WinSCP** for file transfer

---

## 🔧 Initial Raspberry Pi Setup

### Step 1: Flash Raspberry Pi OS (from Windows)

1. **Insert SD Card** into your Windows computer
2. **Open Raspberry Pi Imager**
3. **Click "Choose OS"** → Select **"Raspberry Pi OS (64-bit)"**
4. **Click "Choose Storage"** → Select your SD card
5. **Click the gear icon** (⚙️) to configure:
   - ✅ **Enable SSH**
   - ✅ **Set username** (default: `pi`)
   - ✅ **Set password** (remember this!)
   - ✅ **Configure WiFi** (SSID and password)
   - ✅ **Set locale** (timezone, keyboard)
6. **Click "Write"** → Wait for completion
7. **Eject SD card safely**

### Step 2: First Boot

1. **Insert SD card** into Raspberry Pi
2. **Connect power supply** to Raspberry Pi
3. **Wait 2-3 minutes** for first boot
4. **Find Raspberry Pi IP address** (see next section)

---

## 🔍 Find Raspberry Pi IP Address (from Windows)

### Method 1: Check Router Admin Panel

1. Open browser → Go to router admin (usually `192.168.1.1` or `192.168.0.1`)
2. Login → Look for "Connected Devices" or "DHCP Clients"
3. Find device named "raspberrypi" → Note IP address

### Method 2: Use PowerShell (if Pi is on same network)

```powershell
# Scan local network for Raspberry Pi
arp -a | Select-String "b8-27-eb"  # Pi MAC address prefix

# Or ping broadcast and check ARP table
ping 192.168.1.255
arp -a
```

### Method 3: Use Advanced IP Scanner

1. Download **Advanced IP Scanner**: https://www.advanced-ip-scanner.com/
2. Scan your network
3. Look for device with hostname "raspberrypi"

### Method 4: Use mDNS (if available)

```powershell
# Try to resolve hostname
ping raspberrypi.local

# If this works, IP is shown in response
```

**Note:** Replace `192.168.1.XXX` with your actual Pi IP in all commands below.

---

## 📁 Transfer Files from Windows to Pi

### Method 1: Using WinSCP (GUI - Easiest)

1. **Open WinSCP**
2. **Click "New Session"**
3. **Enter details:**
   - **Host name:** `192.168.1.XXX` (your Pi IP) or `raspberrypi.local`
   - **User name:** `pi`
   - **Password:** (your Pi password)
   - **Protocol:** SFTP
4. **Click "Login"**
5. **Navigate to:** `/home/pi/` on Pi
6. **Drag and drop** `raspberry-pi` folder from Windows to Pi

### Method 2: Using PowerShell SCP

```powershell
# Navigate to project folder
cd C:\Users\Mourya\smart-ai-bin

# Transfer raspberry-pi folder to Pi
scp -r raspberry-pi pi@192.168.1.XXX:/home/pi/smart-ai-bin/

# Enter password when prompted
```

### Method 3: Using VS Code Remote SSH

1. **Install VS Code** → Install **"Remote - SSH"** extension
2. **Press F1** → Type "Remote-SSH: Connect to Host"
3. **Enter:** `pi@192.168.1.XXX`
4. **Enter password**
5. **Open folder:** `/home/pi/smart-ai-bin`
6. **Edit files directly** on Pi from Windows!

---

## 💻 Connect to Raspberry Pi from Windows

### Method 1: Using Windows Terminal / PowerShell

```powershell
# Connect via SSH
ssh pi@192.168.1.XXX

# Or using hostname (if mDNS works)
ssh pi@raspberrypi.local

# Enter password when prompted
```

### Method 2: Using PuTTY

1. **Open PuTTY**
2. **Host Name:** `192.168.1.XXX` or `raspberrypi.local`
3. **Port:** `22`
4. **Connection type:** SSH
5. **Click "Open"**
6. **Login:** `pi` → Enter password

### Method 3: Using VS Code Remote SSH

1. **Open VS Code**
2. **Press F1** → "Remote-SSH: Connect to Host"
3. **Enter:** `pi@192.168.1.XXX`
4. **Enter password**
5. **Now you can edit files directly on Pi!**

---

## 📦 Install Software on Raspberry Pi

### Step 1: Connect to Pi

```powershell
# Connect via SSH
ssh pi@192.168.1.XXX
```

### Step 2: Update System (on Pi)

```bash
# Update package list
sudo apt update

# Upgrade system
sudo apt upgrade -y

# Reboot if needed
sudo reboot
```

### Step 3: Install Dependencies (on Pi)

```bash
# Install Python and build tools
sudo apt-get install -y python3-pip python3-dev python3-venv

# Install OpenCV dependencies
sudo apt-get install -y libopencv-dev python3-opencv

# Install GPIO library
sudo apt-get install -y python3-rpi.gpio

# Install camera library
sudo apt-get install -y python3-picamera2

# Install other dependencies
sudo apt-get install -y libatlas-base-dev libjpeg-dev libpng-dev
```

### Step 4: Install Python Packages (on Pi)

```bash
# Navigate to project folder
cd ~/smart-ai-bin/raspberry-pi

# Create virtual environment (recommended)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip3 install --upgrade pip

# Install requirements
pip3 install -r requirements.txt
```

**If installation fails, install packages individually:**

```bash
pip3 install ultralytics==8.0.196
pip3 install opencv-python==4.8.1.78
pip3 install numpy==1.24.3
pip3 install paho-mqtt==1.6.1
pip3 install RPi.GPIO==0.7.1
pip3 install picamera2==0.3.12
pip3 install python-dotenv==1.0.0
```

### Step 5: Set GPIO Permissions (on Pi)

```bash
# Add user to gpio group
sudo usermod -a -G gpio $USER

# Logout and login again (or reboot)
sudo reboot
```

---

## ⚙️ Configure from Windows

### Option 1: Edit Files Using WinSCP

1. **Connect via WinSCP** (see Transfer Files section)
2. **Navigate to:** `/home/pi/smart-ai-bin/raspberry-pi/`
3. **Right-click** → **Edit** → Choose **Notepad++** or **VS Code**
4. **Edit `.env` file** (create if doesn't exist)

### Option 2: Edit Files Using VS Code Remote SSH

1. **Connect via VS Code Remote SSH**
2. **Open:** `/home/pi/smart-ai-bin/raspberry-pi/.env`
3. **Edit directly** on Pi

### Option 3: Create File from Windows PowerShell

```powershell
# Connect to Pi
ssh pi@192.168.1.XXX

# Create .env file
nano ~/smart-ai-bin/raspberry-pi/.env
```

### Configuration File Content (`.env`)

Create or edit `/home/pi/smart-ai-bin/raspberry-pi/.env`:

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

**Save file** (Ctrl+S in nano, or save in your editor)

---

## 🚀 Run and Monitor from Windows

### Method 1: Run Directly via SSH

```powershell
# Connect to Pi
ssh pi@192.168.1.XXX

# Navigate to folder
cd ~/smart-ai-bin/raspberry-pi

# Activate virtual environment
source venv/bin/activate

# Run main script
python3 main.py
```

**To stop:** Press `Ctrl+C`

### Method 2: Run in Background (Keep Running After Closing Terminal)

```powershell
# Connect to Pi
ssh pi@192.168.1.XXX

# Navigate to folder
cd ~/smart-ai-bin/raspberry-pi

# Activate virtual environment
source venv/bin/activate

# Run in background using nohup
nohup python3 main.py > output.log 2>&1 &

# Disconnect (process keeps running)
exit
```

**To check if running:**
```powershell
ssh pi@192.168.1.XXX
ps aux | grep main.py
```

**To stop background process:**
```powershell
ssh pi@192.168.1.XXX
pkill -f main.py
```

### Method 3: Set Up as System Service (Auto-start on Boot)

**On Raspberry Pi:**

```bash
# Create service file
sudo nano /etc/systemd/system/smartbin.service
```

**Add this content:**

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

**Save** (Ctrl+O, Enter, Ctrl+X in nano)

**Enable and start:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable smartbin
sudo systemctl start smartbin
```

**Check status from Windows:**

```powershell
ssh pi@192.168.1.XXX "sudo systemctl status smartbin"
```

**View logs from Windows:**

```powershell
ssh pi@192.168.1.XXX "sudo journalctl -u smartbin -f"
```

---

## 📊 Monitor from Windows

### View Logs in Real-time

**Using PowerShell:**

```powershell
# Connect and view logs
ssh pi@192.168.1.XXX "tail -f ~/smart-ai-bin/raspberry-pi/output.log"

# Or if using system service
ssh pi@192.168.1.XXX "sudo journalctl -u smartbin -f"
```

**Using PuTTY:**

1. **Connect via PuTTY**
2. **Run:** `tail -f ~/smart-ai-bin/raspberry-pi/output.log`

### Check System Status

**From Windows PowerShell:**

```powershell
# Check if process is running
ssh pi@192.168.1.XXX "ps aux | grep main.py"

# Check system resources
ssh pi@192.168.1.XXX "top -bn1 | head -20"

# Check disk space
ssh pi@192.168.1.XXX "df -h"

# Check network connectivity
ssh pi@192.168.1.XXX "ping -c 3 broker.hivemq.com"
```

### Monitor MQTT Messages (from Windows)

**Install MQTT Client on Windows:**

```powershell
# Install MQTT client using Chocolatey (if installed)
choco install mosquitto

# Or download from: https://mosquitto.org/download/
```

**Subscribe to MQTT topics:**

```powershell
# In PowerShell (if mosquitto installed)
mosquitto_sub -h broker.hivemq.com -t "smartbin/#" -v
```

**Or use online MQTT client:**
- Go to: https://www.hivemq.com/demos/websocket-client/
- Connect to: `broker.hivemq.com:8000`
- Subscribe to: `smartbin/#`

---

## 🧪 Testing from Windows

### Test 1: Verify Connection to Pi

```powershell
# Test SSH connection
ssh pi@192.168.1.XXX "echo 'Connection successful!'"

# Test file transfer
scp test.txt pi@192.168.1.XXX:/tmp/
```

### Test 2: Test GPIO (on Pi)

```powershell
# Connect and test GPIO
ssh pi@192.168.1.XXX
python3 -c "
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.OUT)
GPIO.output(18, GPIO.HIGH)
print('GPIO 18 set HIGH')
"
```

### Test 3: Test Camera (on Pi)

```powershell
# Connect and test camera
ssh pi@192.168.1.XXX
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

### Test 4: Test MQTT Connection (on Pi)

```powershell
# Connect and test MQTT
ssh pi@192.168.1.XXX
cd ~/smart-ai-bin/raspberry-pi
source venv/bin/activate
python3 -c "
from mqtt.mqtt_publish import MQTTPublisher
mqtt = MQTTPublisher('broker.hivemq.com', 1883, 'test_client')
mqtt.connect()
mqtt.publish_system_status('test', 'Connection test')
print('MQTT test published!')
mqtt.disconnect()
"
```

### Test 5: Verify Integration with Backend

**From Windows:**

1. **Make sure backend is running** (on your Windows machine)
2. **Check backend logs** - should show MQTT messages
3. **Open dashboard** - `http://localhost:5174/`
4. **Trigger detection on Pi** - should see updates in dashboard

---

## 🔧 Troubleshooting (Windows-Specific)

### Problem: Can't Connect via SSH

**Solutions:**

```powershell
# Check if SSH is enabled on Pi
# (Should be enabled via Raspberry Pi Imager)

# Try different methods:
ssh pi@192.168.1.XXX
ssh pi@raspberrypi.local
ssh -v pi@192.168.1.XXX  # Verbose mode for debugging

# Check Windows Firewall
# Allow SSH (port 22) in Windows Firewall settings
```

### Problem: "Connection Timed Out"

**Solutions:**

1. **Verify Pi is on same network**
2. **Check IP address** (may have changed)
3. **Ping Pi:**
   ```powershell
   ping 192.168.1.XXX
   ```
4. **Check router** for correct IP

### Problem: "Permission Denied" on SSH

**Solutions:**

```powershell
# Make sure using correct username (usually 'pi')
ssh pi@192.168.1.XXX

# Reset password on Pi (if forgotten)
# You'll need physical access to Pi for this
```

### Problem: File Transfer Fails

**Solutions:**

```powershell
# Use SCP with verbose mode
scp -v -r raspberry-pi pi@192.168.1.XXX:/home/pi/

# Check disk space on Pi
ssh pi@192.168.1.XXX "df -h"

# Use WinSCP GUI instead (easier)
```

### Problem: Can't Edit Files on Pi

**Solutions:**

1. **Use VS Code Remote SSH** (best option)
2. **Use WinSCP** → Right-click → Edit
3. **Use nano via SSH:**
   ```powershell
   ssh pi@192.168.1.XXX
   nano ~/smart-ai-bin/raspberry-pi/.env
   ```

### Problem: Pi Not Found on Network

**Solutions:**

```powershell
# Scan network for Pi
arp -a | Select-String "b8-27-eb"

# Use Advanced IP Scanner (download from web)
# Or check router admin panel
```

### Problem: Process Stops When Closing Terminal

**Solutions:**

```powershell
# Use nohup (see Run section)
# OR use systemd service (see Run section)
# OR use screen/tmux:
ssh pi@192.168.1.XXX
screen -S smartbin
python3 main.py
# Press Ctrl+A then D to detach
# Reattach: screen -r smartbin
```

---

## 📝 Quick Reference Commands (Windows PowerShell)

```powershell
# Connect to Pi
ssh pi@192.168.1.XXX

# Transfer files
scp -r raspberry-pi pi@192.168.1.XXX:/home/pi/smart-ai-bin/

# Run system
ssh pi@192.168.1.XXX "cd ~/smart-ai-bin/raspberry-pi && source venv/bin/activate && python3 main.py"

# Check status
ssh pi@192.168.1.XXX "ps aux | grep main.py"

# View logs
ssh pi@192.168.1.XXX "tail -f ~/smart-ai-bin/raspberry-pi/output.log"

# Restart service
ssh pi@192.168.1.XXX "sudo systemctl restart smartbin"

# Check service status
ssh pi@192.168.1.XXX "sudo systemctl status smartbin"
```

---

## 🎯 Complete Workflow Summary

### Initial Setup (One-time):

1. **Flash SD card** using Raspberry Pi Imager (Windows)
2. **Insert SD card** into Pi and boot
3. **Find Pi IP** address
4. **Transfer project files** using WinSCP or SCP
5. **Connect via SSH** and install dependencies
6. **Configure** `.env` file
7. **Test** connections

### Daily Usage:

1. **Connect to Pi** via SSH
2. **Run system:** `python3 main.py`
3. **Monitor** via dashboard on Windows
4. **Check logs** if needed

### Auto-start Setup:

1. **Create systemd service** (one-time)
2. **Enable service** - runs automatically on boot
3. **Monitor** from Windows anytime

---

## ✅ Windows Tools Checklist

- [ ] Raspberry Pi Imager installed
- [ ] SSH client (Windows Terminal/PuTTY)
- [ ] File transfer tool (WinSCP/VS Code)
- [ ] Text editor (VS Code/Notepad++)
- [ ] MQTT client (optional, for testing)

---

**You're all set! Manage your Raspberry Pi from Windows! 🎉**

