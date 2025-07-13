// File: insight.js
// Path: backend/routes/ai/insight.js
// 👑 Cod1 Crown Certified — AI Insights Retrieval Route

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('@/middleware/authMiddleware');
const AIInsight = require('@/models/ai/AIInsight'); // 👈 Correct model import

// 📈 GET /api/ai/insight — Fetch all AI-generated insights
router.get('/', authenticateUser, async (req, res) => {
  try {
    const insights = await AIInsight.find();
    res.json(insights);
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    res.status(500).json({ message: 'Server error fetching insights' });
  }
});

module.exports = router;

