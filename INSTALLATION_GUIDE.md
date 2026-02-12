# 🚀 Smart AI Bin - Complete Installation Guide

## 📋 What's Included

This is the **COMPLETE** Smart AI Bin system with:
- ✅ Hardware waste detection (Raspberry Pi)
- ✅ Real-time dashboard with live monitoring
- ✅ **Rewards system with webcam bottle submission**
- ✅ **Login/Register with email validation**
- ✅ **3 bottles/day quota system**
- ✅ **Auto database creation with triggers**
- ✅ **Store with 12 redeemable items**
- ✅ **Laptop camera integration**

---

## 🔧 Prerequisites

### Required Software:

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be v18+
   ```
   Download: https://nodejs.org/

2. **MySQL** (v8.0 or higher)
   ```bash
   mysql --version  # Should be 8.0+
   ```
   
   **Install MySQL:**
   - **Ubuntu/Debian:**
     ```bash
     sudo apt update
     sudo apt install mysql-server
     sudo systemctl start mysql
     sudo mysql_secure_installation
     ```
   
   - **Mac:**
     ```bash
     brew install mysql
     brew services start mysql
     ```
   
   - **Windows:**
     Download from: https://dev.mysql.com/downloads/mysql/

3. **Python 3.8+** (for Raspberry Pi component - optional)
   ```bash
   python3 --version
   ```

4. **Webcam** (laptop camera works perfectly!)

---

## 📦 Installation Steps

### Step 1: Extract the Project

```bash
# Extract the archive
tar -xzf smart-ai-bin-complete.tar.gz

# Navigate to project
cd smart-ai-bin

# Verify structure
ls -la
# You should see: client/, server/, raspberry-pi/, docs/
```

---

### Step 2: Setup MySQL Database

#### Option A: Let Server Auto-Create (RECOMMENDED ✅)

The server will automatically:
- Create the database
- Create all tables
- Create triggers
- Everything ready!

**Just configure credentials:**

```bash
cd server
nano .env  # or use any text editor (notepad, vim, etc.)
```

**Edit the `.env` file:**
```env
# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=smartbin_db
DB_PORT=3306

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET=change_this_to_a_long_random_string_12345
JWT_EXPIRES_IN=7d

# Server Config
PORT=3000
MQTT_BROKER=broker.hivemq.com
MQTT_PORT=1883
MQTT_CLIENT_ID=smartbin_server
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Save the file** (Ctrl+X, then Y, then Enter in nano)

#### Option B: Manual Database Creation

If you prefer to create the database manually:

```bash
# Login to MySQL
mysql -u root -p
# Enter your MySQL password

# Create database
CREATE DATABASE smartbin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verify
SHOW DATABASES;

# Exit
exit;
```

---

### Step 3: Install Server Dependencies

```bash
# From project root, go to server folder
cd server

# Install all packages
npm install

# This installs:
# - express, socket.io, mqtt
# - mysql2 (database driver)
# - bcryptjs (password hashing)
# - jsonwebtoken (authentication)
# - cookie-parser, cors, dotenv
```

**Expected output:**
```
added 150 packages in 30s
```

---

### Step 4: Install Client Dependencies

```bash
# From project root, go to client folder
cd ../client

# Install all packages
npm install

# This installs:
# - react, react-dom, react-router-dom
# - axios (API calls)
# - framer-motion (animations)
# - tailwindcss (styling)
# - socket.io-client
# - lucide-react (icons)
```

**Expected output:**
```
added 200 packages in 45s
```

---

### Step 5: (Optional) Install Raspberry Pi Dependencies

Only if you have the physical hardware:

```bash
cd ../raspberry-pi
pip3 install -r requirements.txt
```

---

## 🚀 Running the Application

### You need 2 terminal windows:

### Terminal 1: Start Backend Server

```bash
# From project root
cd server

# Start the server
npm start
```

**Expected output:**
```
========================================
  Smart AI Bin Server
========================================
Server running on port 3000
✓ MySQL Database connected
✓ Database tables initialized
✓ Database triggers created
✓ Connected to MQTT broker
Subscribed to: smartbin/detection
Subscribed to: smartbin/bin_status
Subscribed to: smartbin/system
========================================
```

**✅ If you see all checkmarks, server is ready!**

**❌ If connection fails:**
- Check MySQL is running: `sudo systemctl status mysql`
- Verify password in `.env` file
- Ensure port 3000 is free

**Keep this terminal running!**

---

### Terminal 2: Start Frontend

```bash
# Open a NEW terminal
# From project root
cd client

# Start development server
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**✅ Frontend is ready!**

**Keep this terminal running!**

---

### Terminal 3: (Optional) Start Raspberry Pi

Only if you have physical hardware:

```bash
# Open another terminal
cd raspberry-pi
python3 main.py
```

---

## 🎯 Using the System

### Step 1: Open in Browser

1. Open your web browser (Chrome or Firefox recommended)
2. Go to: **http://localhost:5173**
3. You'll see the **Login page**

### Step 2: Create Account

Since you're new:

1. Click **"Sign up"** link (bottom of login form)
2. Fill in the form:
   - **Full Name:** Your Name
   - **Email:** your@email.com ✅ Must be valid format!
   - **Password:** minimum 6 characters
   - **Confirm Password:** same as above
3. Click **"Sign Up"** button
4. ✅ **Account created!** Auto-logged in → Dashboard

### Step 3: Explore Dashboard

You'll see:
- 📹 Live Camera Feed (placeholder)
- 🗑️ Bin Status (Dry, Wet, Electronic)
- 📊 Statistics Panel
- 🔄 Processing Chamber
- **🎁 "Redeem Points" button** (TOP RIGHT - GREEN)

### Step 4: Submit Bottles (Earn Credits!)

1. Click the **"Redeem Points"** button (green, top right)
2. Browser asks for camera permission → **Click "Allow"**
3. You'll see your **live webcam feed**!
4. Stats panel shows:
   - Total Credits: 0
   - Bottles Today: 0/3
   - Remaining Quota: 3
   - Total Earned: 0

**To Submit a Bottle:**

1. Show bottle (or anything) to your webcam
2. Click **"Submit Bottle (+100 Credits)"** button
3. 🎉 **Success animation!**
4. Your stats update:
   - Credits: +100
   - Bottles Today: 1/3
   - Remaining: 2

**Submit 3 times total:**
- Submission 1: ✅ +100 credits (2 remaining)
- Submission 2: ✅ +100 credits (1 remaining)  
- Submission 3: ✅ +100 credits (QUOTA REACHED!)
- Submission 4: ❌ **QUOTA EXCEEDED WARNING!**

**Warning Modal Shows:**
```
⚠️ Quota Exceeded!
Daily quota exceeded! You can only submit
3 bottles per day. Come back tomorrow!

Your Daily Limit: 3/3
bottles submitted today

[Got it]
```

### Step 5: Visit the Store

From Redeem page:

1. Click **"Store"** button (top right)
2. You'll see **12 items** you can buy:

**Items Available:**
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

### Step 6: Buy an Item

If you have 300 credits:

1. Click **"Stationery Pack"** (250 credits)
2. Confirmation modal appears:
   ```
   📝 Stationery Pack
   Eco-friendly supplies
   
   Cost: 250 credits
   After redemption: 50 credits
   
   [Cancel] [Confirm]
   ```
3. Click **"Confirm"**
4. ✅ **Redeemed!** Success animation
5. Your balance updates:
   - Credits: 300 → 50
   - Total Spent: 0 → 250
6. **Database automatically updated!**

---

## 🗄️ Database Verification

### Check What Happened:

```bash
# Login to MySQL
mysql -u root -p
# Enter password

# Use the database
USE smartbin_db;

# Check your user
SELECT id, email, name, credits, daily_bottles_submitted, total_earned, total_spent 
FROM users;

# Should show:
# credits: 50
# daily_bottles_submitted: 3
# total_earned: 300
# total_spent: 250

# Check bottle submissions
SELECT * FROM bottle_submissions ORDER BY submitted_at DESC LIMIT 10;

# Should show 3 submissions, each with 100 credits

# Check redemptions
SELECT * FROM redemptions ORDER BY redeemed_at DESC LIMIT 10;

# Should show your purchase

# Exit
exit;
```

---

## ✨ Key Features Explained

### 1. Daily Quota (3 Bottles/Day)

**Database Fields:**
- `daily_bottles_submitted` - Count for today
- `daily_quota` - Max allowed (3)
- `last_submission_date` - Reset logic

**How it works:**
- Server checks date on each submission
- If new day → Reset counter to 0
- If same day → Check if < 3
- If >= 3 → Return error, show warning

### 2. Email Validation

**Three layers:**
1. **Client** (React): Validates before submit
2. **Server** (Node.js): Validates with regex
3. **Database** (MySQL): CHECK constraint

**Pattern:** `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$`

### 3. Auto Credit Deduction (SQL Trigger)

**What happens when you buy an item:**

```sql
-- Trigger runs automatically
CREATE TRIGGER before_redemption_insert
BEFORE INSERT ON redemptions
FOR EACH ROW
BEGIN
  -- Check credits
  IF user_credits < item_cost THEN
    ERROR 'Insufficient credits';
  END IF;
  
  -- Auto deduct
  UPDATE users 
  SET credits = credits - cost,
      total_spent = total_spent + cost
  WHERE id = user_id;
END
```

**Benefits:**
- ✅ Atomic operation
- ✅ No race conditions
- ✅ Guaranteed consistency
- ✅ Can't go negative

### 4. Real-Time UI Updates

After any action:
- Credits update instantly
- Quota counter updates
- Total spent updates
- No page refresh needed!

**Uses React state management:**
```javascript
updateUser({
  credits: 50,
  total_spent: 250,
  daily_bottles_submitted: 3
})
// UI reflects immediately!
```

---

## 🔍 Troubleshooting

### Problem: "Cannot connect to MySQL"

**Solution:**
```bash
# Check if MySQL is running
sudo systemctl status mysql
# Should show "active (running)"

# If not running, start it
sudo systemctl start mysql

# On Mac:
brew services start mysql

# Verify you can login
mysql -u root -p
# If this works, MySQL is running

# Check password in server/.env matches your MySQL password
```

### Problem: "Database connection failed"

**Solution:**
```bash
# In server/.env, verify:
DB_HOST=localhost  # Correct
DB_USER=root       # Correct
DB_PASSWORD=your_actual_password  # CHANGE THIS!
DB_NAME=smartbin_db  # Correct
```

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Find what's using port 3000
lsof -i :3000
# or
netstat -ano | findstr :3000

# Kill that process
kill -9 <PID>

# Or change port in server/.env
PORT=3001
```

### Problem: "Camera not working"

**Solution:**
1. **Grant browser permissions:**
   - Chrome: Settings → Privacy → Camera → Allow
   - Firefox: Preferences → Privacy → Camera → Allow

2. **Close other apps using camera** (Zoom, Teams, etc.)

3. **Try different browser** (Chrome recommended)

4. **Restart browser**

5. **Check browser console** (F12) for errors

### Problem: "Email validation error on registration"

**Solution:**
- Ensure email has format: `name@domain.com`
- No spaces in email
- Must have @ and domain
- Valid examples:
  - ✅ john@example.com
  - ✅ user.name@company.co.uk
  - ❌ notanemail
  - ❌ missing@

### Problem: "npm install fails"

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still fails, update npm
npm install -g npm@latest
```

### Problem: "Tables not created"

**Solution:**
```bash
# Manually run SQL script
cd server
mysql -u root -p smartbin_db < database_setup.sql

# Or recreate database
mysql -u root -p
DROP DATABASE IF EXISTS smartbin_db;
CREATE DATABASE smartbin_db;
exit;

# Restart server
npm start
```

---

## 📊 Database Schema

### Tables Created Automatically:

#### 1. users
```sql
- id (INT, PRIMARY KEY)
- email (VARCHAR, UNIQUE) ✉️ validated
- password (VARCHAR) 🔒 hashed
- name (VARCHAR)
- credits (INT) 💰
- bottles_submitted (INT) total
- daily_bottles_submitted (INT) 🔄 today only
- daily_quota (INT) = 3
- last_submission_date (DATE)
- total_earned (INT) 📈
- total_spent (INT) 📉
- created_at, updated_at
```

#### 2. bottle_submissions
```sql
- id (INT, PRIMARY KEY)
- user_id (INT, FOREIGN KEY)
- credits_earned (INT) = 100
- submitted_at (TIMESTAMP)
```

#### 3. redemptions
```sql
- id (INT, PRIMARY KEY)
- user_id (INT, FOREIGN KEY)
- item_name (VARCHAR)
- item_cost (INT)
- quantity (INT)
- total_cost (INT)
- redeemed_at (TIMESTAMP)
```

#### 4. detection_logs
```sql
- id (INT, PRIMARY KEY)
- waste_type (VARCHAR)
- confidence (FLOAT)
- destination (VARCHAR)
- detected_at (TIMESTAMP)
```

### Triggers Created:

#### before_redemption_insert
- Checks if user has enough credits
- Deducts credits automatically
- Updates total_spent
- Prevents negative balance

---

## 🎯 Quick Reference Commands

### Start Everything:
```bash
# Terminal 1
cd server && npm start

# Terminal 2 (new terminal)
cd client && npm run dev

# Browser
http://localhost:5173
```

### Stop Everything:
```bash
# In each terminal: Ctrl + C
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

### Check Database:
```bash
mysql -u root -p
USE smartbin_db;
SELECT * FROM users;
SELECT * FROM bottle_submissions;
SELECT * FROM redemptions;
exit;
```

---

## 📱 Page Routes

- **/** → Redirects to /login
- **/login** → Login form
- **/register** → Sign up form
- **/dashboard** → Main monitoring (protected)
- **/redeem** → Submit bottles via webcam (protected)
- **/store** → Buy rewards (protected)

All routes except /login and /register require authentication!

---

## 🎓 Tips

1. **First time?** Follow this guide step by step
2. **Camera issues?** Grant browser permissions
3. **MySQL errors?** Check credentials in .env
4. **Port conflicts?** Change PORT in .env
5. **Need help?** Check docs/ folder

---

## 📚 Documentation Files

- `SETUP_GUIDE.md` → This file
- `FEATURES_GUIDE.md` → Feature walkthrough
- `QUICKSTART.md` → Quick commands
- `docs/new-features.md` → Technical details
- `docs/rewards-system.md` → API documentation
- `docs/api-documentation.md` → API reference

---

## ✅ Success Checklist

Before considering setup complete:

- [ ] MySQL installed and running
- [ ] Node.js v18+ installed
- [ ] Project extracted
- [ ] server/.env configured with MySQL password
- [ ] Server dependencies installed (npm install)
- [ ] Client dependencies installed (npm install)
- [ ] Server starts without errors
- [ ] Client starts without errors
- [ ] Can register new account
- [ ] Can login
- [ ] Dashboard loads
- [ ] Camera activates on redeem page
- [ ] Can submit bottle (earn 100 credits)
- [ ] Quota warning appears after 3 bottles
- [ ] Can buy items in store
- [ ] Credits deduct correctly
- [ ] Database contains data

---

## 🎉 You're All Set!

If you've completed all steps, your Smart AI Bin system is fully operational!

**Next Steps:**
1. Create your account
2. Submit 3 bottles (earn 300 credits)
3. Buy rewards from the store
4. Check database to see everything tracked

**Enjoy your AI-powered waste management system!** 🚀
