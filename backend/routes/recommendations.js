// File: recommendations.js
// Path: backend/routes/recommendations.js

const express = require('express');
const router = express.Router();
const { getLoanRecommendations } = require('../../controllers/recommendations/loanRecommendationController');
const authenticate = require('../../middleware/authenticate');

// @route   GET /api/loans/recommendations
// @desc    Get loan recommendations based on buyer ID and priority
// @access  Private
router.get('/loans/recommendations', authenticate, getLoanRecommendations);

module.exports = router;
