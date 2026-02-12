# Rewards System Documentation

## Overview
The Smart AI Bin now includes a complete rewards system where users can submit plastic bottles via webcam to earn credits and redeem them for various items.

## Features

### 🔐 User Authentication
- User registration with email and password
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Protected routes requiring authentication

### 💰 Credit System
- **100 credits** per plastic bottle submitted
- Credits stored in MySQL database
- Real-time credit balance updates
- Transaction history tracking

### 📷 Webcam Integration
- Live camera feed for bottle verification
- Submit bottles directly through the web interface
- Works with laptop/desktop webcams
- Real-time feedback on submissions

### 🎁 Rewards Store
- 12 redeemable items with varying costs
- Categories: Vouchers, Products, Eco items, Tech, Subscriptions
- Instant credit deduction on redemption
- Redemption history tracking

## Database Schema

### Users Table
```sql
- id (INT, PRIMARY KEY)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, HASHED)
- name (VARCHAR)
- credits (INT, DEFAULT 0)
- bottles_submitted (INT, DEFAULT 0)
- total_earned (INT, DEFAULT 0)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Bottle Submissions Table
```sql
- id (INT, PRIMARY KEY)
- user_id (INT, FOREIGN KEY)
- credits_earned (INT, DEFAULT 100)
- submitted_at (TIMESTAMP)
```

### Redemptions Table
```sql
- id (INT, PRIMARY KEY)
- user_id (INT, FOREIGN KEY)
- item_name (VARCHAR)
- item_cost (INT)
- quantity (INT)
- total_cost (INT)
- redeemed_at (TIMESTAMP)
```

## API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me (Protected)
```

### Rewards
```
POST /api/rewards/submit-bottle (Protected)
POST /api/rewards/redeem (Protected)
GET  /api/rewards/redemption-history (Protected)
GET  /api/rewards/bottle-history (Protected)
```

## Setup Instructions

### 1. Database Setup

**Option A: Automatic (Recommended)**
The database tables will be created automatically when you start the server.

**Option B: Manual**
```bash
mysql -u root -p < server/database_setup.sql
```

### 2. Environment Variables

Update `server/.env`:
```env
# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smartbin_db
DB_PORT=3306

# JWT Secret (change this!)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

### 3. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 4. Run the Application

**Terminal 1 - Server:**
```bash
cd server
npm start
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

## User Flow

### First Time User
1. Navigate to http://localhost:5173
2. Click "Sign up" on login page
3. Enter name, email, and password
4. Automatically logged in and redirected to dashboard

### Earning Credits
1. From Dashboard, click "Redeem Points" button
2. Allow camera access when prompted
3. Show empty plastic bottle to camera
4. Click "Submit Bottle (+100 Credits)"
5. See success animation and updated credit balance

### Redeeming Rewards
1. From Redeem page, click "Store" button
2. Browse available rewards
3. Click on any item you can afford
4. Confirm redemption in modal
5. Credits automatically deducted
6. Redemption logged in database

## Reward Items & Costs

| Item | Cost | Category |
|------|------|----------|
| Amazon Gift Card | 500 | Vouchers |
| Flipkart Voucher | 500 | Vouchers |
| Stationery Pack | 250 | Products |
| Plant Seedlings | 300 | Eco |
| Phone Accessories | 400 | Tech |
| Tote Bag | 600 | Products |
| Bamboo Cutlery Set | 700 | Products |
| Reusable Water Bottle | 800 | Products |
| Zomato Gold | 800 | Subscriptions |
| Netflix 1 Month | 1000 | Subscriptions |
| Headphones | 1500 | Tech |
| Fitness Tracker | 2000 | Tech |

## Security Features

- **Password Hashing**: All passwords hashed with bcrypt (10 rounds)
- **JWT Authentication**: Secure token-based auth with expiration
- **Protected Routes**: API and frontend routes require valid tokens
- **SQL Injection Protection**: Parameterized queries throughout
- **CORS Configuration**: Restricted cross-origin access

## Database Queries

### Get User Stats
```sql
SELECT credits, bottles_submitted, total_earned 
FROM users WHERE id = ?
```

### Submit Bottle (Transaction)
```sql
BEGIN TRANSACTION;
INSERT INTO bottle_submissions (user_id, credits_earned) VALUES (?, 100);
UPDATE users SET 
  credits = credits + 100,
  bottles_submitted = bottles_submitted + 1,
  total_earned = total_earned + 100
WHERE id = ?;
COMMIT;
```

### Redeem Item (Transaction)
```sql
BEGIN TRANSACTION;
INSERT INTO redemptions (user_id, item_name, item_cost, total_cost) 
VALUES (?, ?, ?, ?);
UPDATE users SET credits = credits - ? WHERE id = ?;
COMMIT;
```

## Troubleshooting

### Camera Not Working
- Ensure HTTPS or localhost (browsers require secure context)
- Check browser permissions
- Try different browser (Chrome/Firefox recommended)

### Database Connection Failed
- Verify MySQL is running: `sudo systemctl status mysql`
- Check credentials in `.env`
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### JWT Token Errors
- Clear browser localStorage
- Re-login to get fresh token
- Check JWT_SECRET is set in .env

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Admin dashboard for managing rewards
- [ ] Leaderboard system
- [ ] Social sharing features
- [ ] Mobile app version
- [ ] QR code for quick login
- [ ] Partner integration for real rewards

## Tech Stack

- **Frontend**: React 18, React Router, Framer Motion, Axios
- **Backend**: Node.js, Express, JWT, bcryptjs
- **Database**: MySQL 8.0+
- **Real-time**: Socket.IO (for live updates)
- **Authentication**: JWT with localStorage
