// File: export.js
// Path: backend/routes/lender/export.js

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('@/middleware/authMiddleware');
const { exportData } = require('@/controllers/lender/exportController');

/**
 * @route   GET /api/lender/export/:type
 * @desc    Export lender data (loan bids, approved loans, reputation)
 * @query   format=csv|pdf (optional), from, to
 * @access  Private
 */
router.get('/:type', authenticateUser, exportData);

module.exports = router;
