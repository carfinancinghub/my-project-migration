// File: recommendations.js
// Path: backend/routes/ai/recommendations.js
// 👑 Cod1 Crown Certified — AI Smart Recommendations Router

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('@/middleware/authMiddleware');
const Recommendation = require('@/models/ai/Recommendation');

// 📈 GET all AI recommendations
router.get('/', authenticateUser, async (req, res) => {
  try {
    const recommendations = await Recommendation.find();
    res.json(recommendations);
  } catch (error) {
    console.error('Fetch recommendations error:', error);
    res.status(500).json({ message: 'Server error fetching recommendations' });
  }
});

module.exports = router;
