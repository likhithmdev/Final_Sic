const pool = require('../database/connection');

class AdminController {
  // Get summary of users and their reward stats for organization dashboard
  async getUsersSummary(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT id, name, email, credits, bottles_submitted, total_earned, created_at
         FROM users
         ORDER BY total_earned DESC
         LIMIT 100`
      );

      res.json({
        success: true,
        users: rows,
      });
    } catch (error) {
      console.error('Admin users summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users summary',
      });
    }
  }
}

module.exports = new AdminController();

