// File: profile.js
// Path: backend/routes/lender/profile.js

const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const LenderReputation = require('../../models/LenderReputation');
const { protect } = require('../../middleware/auth');

// @route   GET /api/lender/:lenderId/profile
// @desc    Public lender profile + reputation
// @access  Public
router.get('/:lenderId/profile', async (req, res) => {
  try {
    const lender = await User.findById(req.params.lenderId).select('-password');
    if (!lender || lender.role !== 'lender') {
      return res.status(404).json({ message: 'Lender not found' });
    }

    const reputation = await LenderReputation.findOne({ lender: lender._id })
      .populate('reviews.reviewer', 'username')
      .lean();

    res.json({ lender, reputation });
  } catch (err) {
    console.error('Error fetching lender profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
