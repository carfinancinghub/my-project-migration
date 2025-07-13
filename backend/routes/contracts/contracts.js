// File: contracts.js
// Path: backend/routes/contracts/contracts.js

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('@/middleware/authMiddleware');
const Contract = require('@/models/contract/Contract');

// @route   GET /api/contracts
// @desc    Get all contracts for current user or admin
// @access  Private
router.get('/', authenticateUser, async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? {}
      : { participants: req.user.id };

    const contracts = await Contract.find(query)
      .sort({ createdAt: -1 });

    res.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ message: 'Failed to load contracts' });
  }
});

module.exports = router;