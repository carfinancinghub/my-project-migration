// File: lender-reputation.js
// Path: backend/routes/lender/lender-reputation.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getLenderReputation,
  addLenderReview
} = require('../controllers/lender/lenderReputationController');

// @route   GET /api/lender-reputation/:lenderId
// @desc    Get a lender's reputation profile
// @access  Public
router.get('/:lenderId', getLenderReputation);

// @route   POST /api/lender-reputation/:lenderId/review
// @desc    Submit a review for a lender
// @access  Private
router.post('/:lenderId/review', protect, addLenderReview);

module.exports = router;
