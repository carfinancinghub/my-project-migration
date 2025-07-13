// File: haulerReputationRoute.js
// Path: backend/routes/reputation/haulerReputationRoute.js
// 👑 Cod1 Crown Certified — Reputation API for Hauler Transparency

const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const HaulerReputation = require('../../models/hauler/HaulerReputation');

// @route   GET /api/reputation/hauler/:haulerId
// @desc    Fetch hauler's reputation data
// @access  Protected (for buyers, admins, haulers themselves)
router.get('/hauler/:haulerId', authenticate, async (req, res) => {
  try {
    const rep = await HaulerReputation.findOne({ haulerId: req.params.haulerId });
    if (!rep) return res.status(404).json({ message: 'No reputation data available for this hauler.' });

    res.json(rep);
  } catch (err) {
    console.error('Error fetching hauler reputation:', err);
    res.status(500).json({ message: 'Failed to retrieve reputation data.' });
  }
});

module.exports = router;
