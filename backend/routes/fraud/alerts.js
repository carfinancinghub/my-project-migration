// File: alerts.js
// Path: backend/routes/fraud/alerts.js

const express = require('express');
const router = express.Router();
const { authenticateUser, authorize } = require('@/middleware/authMiddleware');

const FraudAlert = require('@/models/fraud/FraudAlert');

// @route   GET /api/fraud/alerts
// @desc    Get all fraud alerts (admin only)
// @access  Private/Admin
router.get('/', authenticateUser, authorize('admin'), async (req, res) => {
  try {
    const { status, level, sort = 'createdAt', order = 'desc', limit = 50, page = 1 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (level) query.level = level;

    const options = {
      sort: { [sort]: order === 'asc' ? 1 : -1 },
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    };

    const alerts = await FraudAlert.find(query, null, options);

    res.json({ count: alerts.length, alerts });
  } catch (error) {
    console.error('Error fetching fraud alerts:', error);
    res.status(500).json({ message: 'Failed to load alerts' });
  }
});

module.exports = router;