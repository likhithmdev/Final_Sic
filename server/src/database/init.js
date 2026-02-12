const pool = require('./connection');

const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Create users table
    await connection.query(`
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
      )
    `);

    // Create redemptions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS redemptions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        item_cost INT NOT NULL,
        quantity INT DEFAULT 1,
        total_cost INT NOT NULL,
        redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id)
      )
    `);

    // Create bottle_submissions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bottle_submissions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        credits_earned INT DEFAULT 100,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_submitted_at (submitted_at)
      )
    `);

    // Create detection_logs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS detection_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        waste_type VARCHAR(50) NOT NULL,
        confidence FLOAT NOT NULL,
        destination VARCHAR(50) NOT NULL,
        detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_detected_at (detected_at)
      )
    `);

    connection.release();
    console.log('✓ Database tables initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

module.exports = { initDatabase };
