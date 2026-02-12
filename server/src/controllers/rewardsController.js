const pool = require('../database/connection');
const activeUserStore = require('../services/activeUserStore');

// Points per waste type: dry (plastic) = 5, electronic = 10, wet = 0
const POINTS_BY_WASTE_TYPE = {
  dry: 5,
  electronic: 10,
  wet: 0,
};

class RewardsController {
  // Credit user when bin segregates plastic or e-waste (called from MQTT handler)
  async creditFromBin(userId, wasteType) {
    const credits = POINTS_BY_WASTE_TYPE[wasteType];
    if (!credits || credits <= 0) return null;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        'INSERT INTO bottle_submissions (user_id, credits_earned) VALUES (?, ?)',
        [userId, credits]
      );

      await connection.query(
        'UPDATE users SET credits = credits + ?, bottles_submitted = bottles_submitted + 1, total_earned = total_earned + ? WHERE id = ?',
        [credits, credits, userId]
      );

      const [users] = await connection.query(
        'SELECT credits, bottles_submitted, total_earned FROM users WHERE id = ?',
        [userId]
      );

      await connection.commit();
      return users[0];
    } catch (error) {
      await connection.rollback();
      console.error('Credit from bin error:', error);
      return null;
    } finally {
      connection.release();
    }
  }

  // Check in: set this user as active for bin disposals
  checkIn(req, res) {
    activeUserStore.setActiveUser(req.user.id);
    res.json({ success: true, message: "You're checked in. Dispose plastic or e-waste to earn points!" });
  }

  // Check out: clear active user
  checkOut(req, res) {
    activeUserStore.clearActiveUser();
    res.json({ success: true, message: 'Checked out.' });
  }

  // Get check-in status for current user
  getCheckInStatus(req, res) {
    const checkedIn = activeUserStore.isActiveUser(req.user.id);
    res.json({ success: true, checked_in: checkedIn });
  }

  // Submit bottle and earn credits
  async submitBottle(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const userId = req.user.id;
      const creditsEarned = 100;

      // Add bottle submission record
      await connection.query(
        'INSERT INTO bottle_submissions (user_id, credits_earned) VALUES (?, ?)',
        [userId, creditsEarned]
      );

      // Update user credits
      await connection.query(
        'UPDATE users SET credits = credits + ?, bottles_submitted = bottles_submitted + 1, total_earned = total_earned + ? WHERE id = ?',
        [creditsEarned, creditsEarned, userId]
      );

      // Get updated user data
      const [users] = await connection.query(
        'SELECT credits, bottles_submitted, total_earned FROM users WHERE id = ?',
        [userId]
      );

      await connection.commit();

      res.json({
        success: true,
        message: 'Bottle submitted successfully!',
        credits_earned: creditsEarned,
        user: users[0]
      });
    } catch (error) {
      await connection.rollback();
      console.error('Submit bottle error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit bottle'
      });
    } finally {
      connection.release();
    }
  }

  // Redeem item
  async redeemItem(req, res) {
    const connection = await pool.getConnection();
    
    try {
      const { item_name, item_cost, quantity = 1 } = req.body;
      const userId = req.user.id;
      const totalCost = item_cost * quantity;

      // Check user credits
      const [users] = await connection.query(
        'SELECT credits FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (users[0].credits < totalCost) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient credits'
        });
      }

      await connection.beginTransaction();

      // Add redemption record
      await connection.query(
        'INSERT INTO redemptions (user_id, item_name, item_cost, quantity, total_cost) VALUES (?, ?, ?, ?, ?)',
        [userId, item_name, item_cost, quantity, totalCost]
      );

      // Deduct credits
      await connection.query(
        'UPDATE users SET credits = credits - ? WHERE id = ?',
        [totalCost, userId]
      );

      // Get updated credits
      const [updated] = await connection.query(
        'SELECT credits FROM users WHERE id = ?',
        [userId]
      );

      await connection.commit();

      res.json({
        success: true,
        message: 'Item redeemed successfully!',
        remaining_credits: updated[0].credits
      });
    } catch (error) {
      await connection.rollback();
      console.error('Redeem item error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to redeem item'
      });
    } finally {
      connection.release();
    }
  }

  // Get user's redemption history
  async getRedemptionHistory(req, res) {
    try {
      const [redemptions] = await pool.query(
        'SELECT * FROM redemptions WHERE user_id = ? ORDER BY redeemed_at DESC LIMIT 50',
        [req.user.id]
      );

      res.json({
        success: true,
        redemptions
      });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch history'
      });
    }
  }

  // Get user's bottle submission history
  async getBottleHistory(req, res) {
    try {
      const [bottles] = await pool.query(
        'SELECT * FROM bottle_submissions WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 50',
        [req.user.id]
      );

      res.json({
        success: true,
        bottles
      });
    } catch (error) {
      console.error('Get bottle history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bottle history'
      });
    }
  }
}

module.exports = new RewardsController();
