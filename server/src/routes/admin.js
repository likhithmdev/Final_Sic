const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

// For now we just require a valid authenticated user.
// If you later add roles, you can add an isAdmin check here.
router.use(authMiddleware);

router.get('/users-summary', adminController.getUsersSummary);

module.exports = router;

