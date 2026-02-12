const express = require('express');
const router = express.Router();
const detectionController = require('../controllers/detectionController');

// Get detection statistics
router.get('/stats', (req, res) => {
  const stats = detectionController.getStats();
  res.json({
    success: true,
    data: stats
  });
});

// Get detection history
router.get('/history', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const history = detectionController.getHistory(limit);
  res.json({
    success: true,
    count: history.length,
    data: history
  });
});

// Clear history
router.post('/history/clear', (req, res) => {
  detectionController.clearHistory();
  res.json({
    success: true,
    message: 'History cleared'
  });
});

// Reset statistics
router.post('/stats/reset', (req, res) => {
  detectionController.resetStats();
  res.json({
    success: true,
    message: 'Statistics reset'
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
