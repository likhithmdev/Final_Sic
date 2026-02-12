-- Smart AI Bin Database Setup
-- Run this script to manually create the database and tables

CREATE DATABASE IF NOT EXISTS smartbin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE smartbin_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  credits INT DEFAULT 0,
  bottles_submitted INT DEFAULT 0,
  total_earned INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Redemptions table
CREATE TABLE IF NOT EXISTS redemptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  item_cost INT NOT NULL,
  quantity INT DEFAULT 1,
  total_cost INT NOT NULL,
  redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_redeemed_at (redeemed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bottle submissions table
CREATE TABLE IF NOT EXISTS bottle_submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  credits_earned INT DEFAULT 100,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Detection logs table
CREATE TABLE IF NOT EXISTS detection_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  waste_type VARCHAR(50) NOT NULL,
  confidence FLOAT NOT NULL,
  destination VARCHAR(50) NOT NULL,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_detected_at (detected_at),
  INDEX idx_waste_type (waste_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data (optional)
-- INSERT INTO users (email, password, name, credits) 
-- VALUES ('test@example.com', '$2a$10$samplehashedpassword', 'Test User', 500);
