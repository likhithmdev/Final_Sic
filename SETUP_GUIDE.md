# 🚀 Smart AI Bin - Complete Setup & Usage Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Database Setup](#database-setup)
4. [Running the Application](#running-the-application)
5. [Using the System](#using-the-system)
6. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Prerequisites

Before starting, make sure you have:

### Required Software:
- ✅ **Node.js** (v18 or higher)
  - Check: `node --version`
  - Download: https://nodejs.org/

- ✅ **MySQL** (v8.0 or higher)
  - Check: `mysql --version`
  - Download: https://dev.mysql.com/downloads/mysql/

- ✅ **npm** (comes with Node.js)
  - Check: `npm --version`

- ✅ **Python 3.8+** (for Raspberry Pi component)
  - Check: `python3 --version`

- ✅ **Webcam/Camera** (laptop camera works fine)

---

## 2️⃣ Installation Steps

### Step 1: Extract the Project

```bash
# Extract the archive
tar -xzf smart-ai-bin-complete-rewards.tar.gz

# Navigate to project directory
cd smart-ai-bin

# Check the structure
ls -la
# You should see: client/, server/, raspberry-pi/, docs/, models/, etc.
```

### Step 2: Install Server Dependencies

```bash
# Go to server folder
cd server

# Install all Node.js packages
npm install

# This will install:
# - express, socket.io, mqtt
# - mysql2 (for database)
# - bcryptjs (for password hashing)
# - jsonwebtoken (for authentication)
# - cors, dotenv, etc.
```

### Step 3: Install Client Dependencies

```bash
# Go to client folder (from project root)
cd ../client

# Install all React packages
npm install

# This will install:
# - react, react-dom, react-router-dom
# - axios (for API calls)
# - framer-motion (for animations)
# - tailwindcss (for styling)
# - socket.io-client, lucide-react
```

### Step 4: Install Raspberry Pi Dependencies (Optional)

```bash
# Only if you're using the Raspberry Pi for physical waste detection
cd ../raspberry-pi

pip3 install -r requirements.txt

# This installs:
# - ultralytics (YOLO)
# - opencv-python
# - paho-mqtt
# - RPi.GPIO (if on Raspberry Pi)
```

---

## 3️⃣ Database Setup

### Option A: Automatic Setup (Recommended)

The database will be created automatically when you start the server!

**Just configure your credentials:**

```bash
cd server
nano .env  # or use any text editor
```

**Edit these lines in `.env`:**
```env
# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=smartbin_db
DB_PORT=3306

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
MQTT_BROKER=broker.hivemq.com
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Save and exit** (Ctrl+X, then Y, then Enter in nano)

### Option B: Manual Database Setup

If you prefer to create the database manually:

```bash
# Login to MySQL
mysql -u root -p
# Enter your MySQL password

# Create the database
CREATE DATABASE smartbin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit MySQL
exit;

# Or run the provided SQL script
mysql -u root -p < server/database_setup.sql
```

---

## 4️⃣ Running the Application

You need **2 terminal windows** (or 3 if using Raspberry Pi):

### Terminal 1: Start the Backend Server

```bash
# From project root
cd server

# Start the server
npm start

# You should see:
# ========================================
#   Smart AI Bin Server
# ========================================
# Server running on port 3000
# ✓ MySQL Database connected
# ✓ Database tables initialized
# ✓ Connected to MQTT broker
# ========================================
```

**Keep this terminal open!**

### Terminal 2: Start the Frontend

```bash
# Open a NEW terminal
# From project root
cd client

# Start the development server
npm run dev

# You should see:
# VITE v5.0.8  ready in 500 ms
#
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
```

**Keep this terminal open too!**

### Terminal 3: Start Raspberry Pi (Optional)

Only if you have the physical hardware:

```bash
# Open a NEW terminal
# From project root
cd raspberry-pi

# Run the main program
python3 main.py

# You should see:
# Initializing Smart Bin System
# Model loaded successfully
# GPIO initialized
# System initialization complete
# Smart Bin System running - waiting for objects
```

---

## 5️⃣ Using the System

### 🎯 First Time User Journey

#### Step 1: Open the Application

1. Open your web browser (Chrome or Firefox recommended)
2. Go to: **http://localhost:5173**
3. You'll see the **Login page**

#### Step 2: Create an Account

Since you're a new user:

1. Click **"Sign up"** link at the bottom
2. Fill in the registration form:
   - **Full Name**: John Doe
   - **Email**: john@example.com
   - **Password**: (at least 6 characters)
   - **Confirm Password**: (same as above)
3. Click **"Sign Up"** button
4. ✅ Account created! You're automatically logged in

#### Step 3: View the Dashboard

After registration, you'll see the **Main Dashboard**:

- 📹 Live Camera Feed (not active yet, needs webcam on redeem page)
- 🗑️ Bin Status (Dry, Wet, Electronic bins)
- 📊 Detection Statistics
- 🔄 Processing Chamber status
- **🎁 "Redeem Points" button** (top right)

#### Step 4: Submit Bottles to Earn Credits

1. Click the **"Redeem Points"** button (green button in header)
2. You'll be taken to the **Redeem Points page**
3. **Allow camera access** when prompted by browser
   - Click "Allow" on the camera permission popup
4. You'll see your live webcam feed
5. Current stats shown on the right:
   - Credits: 0
   - Bottles Submitted: 0
   - Total Earned: 0

**To Submit a Bottle:**

1. Hold a plastic bottle in front of your webcam
2. Click **"Submit Bottle (+100 Credits)"** button
3. 🎉 **Success animation appears!**
4. Your credits increase by 100
5. Stats update automatically:
   - Credits: 100
   - Bottles Submitted: 1
   - Total Earned: 100

**Repeat as many times as you want!**

#### Step 5: View the Rewards Store

From the Redeem Points page:

1. Click **"Store"** button (top right)
2. You'll see the **Rewards Store** with 12 items

**Available Items:**
- 📝 Stationery Pack - 250 credits
- 🌱 Plant Seedlings - 300 credits
- 📱 Phone Accessories - 400 credits
- 🎁 Amazon Gift Card - 500 credits
- 🛍️ Flipkart Voucher - 500 credits
- 👜 Tote Bag - 600 credits
- 🥢 Bamboo Cutlery - 700 credits
- 💧 Water Bottle - 800 credits
- 🍔 Zomato Gold - 800 credits
- 📺 Netflix 1 Month - 1000 credits
- 🎧 Headphones - 1500 credits
- ⌚ Fitness Tracker - 2000 credits

#### Step 6: Redeem an Item

**If you have enough credits:**

1. Click on any item you can afford (not grayed out)
2. A **confirmation modal** appears showing:
   - Item name and description
   - Cost in credits
   - Your balance after purchase
3. Click **"Confirm"** to buy
4. ✅ Success! Credits deducted
5. Item redemption logged in database

**If you don't have enough credits:**
- Items appear grayed out
- Shows "Insufficient credits" message
- Go back and submit more bottles!

---

## 6️⃣ Navigation

### Page Routes:

- **Login**: http://localhost:5173/login
- **Register**: http://localhost:5173/register
- **Dashboard**: http://localhost:5173/dashboard
- **Redeem Points**: http://localhost:5173/redeem
- **Store**: http://localhost:5173/store

### Navigation Flow:

```
Login ──────────────────→ Dashboard
  ↓                           ↓
Register               [Redeem Points Button]
  ↓                           ↓
Dashboard              Redeem Points Page
                              ↓
                       [Store Button]
                              ↓
                         Store Page
                              ↓
                       [Back to Redeem]
                              ↓
                       Redeem Points Page
```

---

## 7️⃣ Database Tracking

### What Gets Stored:

**When you register:**
```sql
INSERT INTO users (email, password, name, credits)
VALUES ('john@example.com', 'hashed_password', 'John Doe', 0)
```

**When you submit a bottle:**
```sql
-- Record the submission
INSERT INTO bottle_submissions (user_id, credits_earned)
VALUES (1, 100)

-- Update user credits
UPDATE users 
SET credits = credits + 100,
    bottles_submitted = bottles_submitted + 1,
    total_earned = total_earned + 100
WHERE id = 1
```

**When you redeem an item:**
```sql
-- Record the redemption
INSERT INTO redemptions (user_id, item_name, item_cost, total_cost)
VALUES (1, 'Amazon Gift Card', 500, 500)

-- Deduct credits
UPDATE users 
SET credits = credits - 500
WHERE id = 1
```

### View Your Data:

```bash
# Login to MySQL
mysql -u root -p

# Use the database
USE smartbin_db;

# See all users
SELECT id, email, name, credits, bottles_submitted, total_earned FROM users;

# See bottle submissions
SELECT * FROM bottle_submissions ORDER BY submitted_at DESC LIMIT 10;

# See redemptions
SELECT * FROM redemptions ORDER BY redeemed_at DESC LIMIT 10;

# Exit
exit;
```

---

## 8️⃣ Troubleshooting

### Problem: "Cannot connect to MySQL"

**Solution:**
```bash
# Check if MySQL is running
sudo systemctl status mysql
# or on Mac:
brew services list

# Start MySQL if not running
sudo systemctl start mysql
# or on Mac:
brew services start mysql

# Verify credentials in server/.env
DB_USER=root
DB_PASSWORD=your_correct_password
```

### Problem: "Camera not working"

**Solution:**
1. Grant browser camera permissions
2. Check browser settings → Privacy → Camera
3. Try a different browser (Chrome recommended)
4. Ensure no other app is using the camera
5. Restart browser

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000
# or on Windows:
netstat -ano | findstr :3000

# Kill the process
kill -9 <PID>

# Or change the port in server/.env
PORT=3001
```

### Problem: "npm install fails"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still fails, update npm
npm install -g npm@latest
```

### Problem: "Invalid token" error

**Solution:**
```bash
# Clear browser storage
# Press F12 → Application tab → Local Storage → Clear All
# Or manually clear localStorage
localStorage.clear()

# Re-login
```

### Problem: "CORS error"

**Solution:**
```bash
# Check server/.env has correct CORS_ORIGIN
CORS_ORIGIN=http://localhost:5173

# Restart server after changing
```

### Problem: Database tables not created

**Solution:**
```bash
# Manually run the SQL script
cd server
mysql -u root -p smartbin_db < database_setup.sql

# Or drop and recreate database
mysql -u root -p
DROP DATABASE IF EXISTS smartbin_db;
CREATE DATABASE smartbin_db;
exit;

# Restart server (tables auto-create)
npm start
```

---

## 9️⃣ Testing the System

### Quick Test Checklist:

1. ✅ Server starts without errors
2. ✅ Client starts and opens in browser
3. ✅ Can register new account
4. ✅ Can login with credentials
5. ✅ Dashboard loads with bins and stats
6. ✅ "Redeem Points" button works
7. ✅ Camera activates on redeem page
8. ✅ Can submit bottle and earn 100 credits
9. ✅ Store page shows all items
10. ✅ Can redeem item with sufficient credits
11. ✅ Credits deducted correctly
12. ✅ All data appears in MySQL database

### Test Commands:

```bash
# Check if server is running
curl http://localhost:3000/api/health

# Should return: {"success":true,"status":"healthy"}

# Check if database is working
mysql -u root -p -e "USE smartbin_db; SELECT COUNT(*) FROM users;"
```

---

## 🎯 Quick Reference

### Start Everything:
```bash
# Terminal 1
cd server && npm start

# Terminal 2
cd client && npm run dev

# Open browser
http://localhost:5173
```

### Stop Everything:
```bash
# In each terminal, press:
Ctrl + C
```

### Reset Database:
```bash
mysql -u root -p
DROP DATABASE smartbin_db;
CREATE DATABASE smartbin_db;
exit;

# Restart server
cd server && npm start
```

### View Logs:
```bash
# Server logs in Terminal 1
# Client logs in Terminal 2
# Browser console: F12 → Console tab
```

---

## 📞 Need Help?

### Documentation Files:
- `README.md` - Project overview
- `QUICKSTART.md` - Quick setup guide
- `docs/rewards-system.md` - Detailed rewards docs
- `docs/api-documentation.md` - API reference
- `docs/setup-guide.md` - Hardware setup
- `FEATURES_GUIDE.md` - Feature walkthrough

### Common Issues:
- Check all `.env` files are configured correctly
- Ensure MySQL is running
- Check port 3000 and 5173 are available
- Grant camera permissions in browser
- Clear browser cache/localStorage if issues persist

---

**🎉 That's it! You're ready to use the Smart AI Bin Rewards System!**

Start earning credits and redeeming awesome rewards! 🚀
