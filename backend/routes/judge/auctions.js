// File: auctions.js
// Path: backend/routes/judge/auctions.js
// Purpose: Judge API to retrieve auction data, dispute metadata, and bidding trends
// Author: Cod1 (05111359 - PDT)
// 👑 Cod2 Crown Certified

const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');
const Auction = require('@models/auction');

/**
 * Functions Summary:
 * - GET /api/judge/auctions: Returns auction records with optional dispute and analytics info (free + paid)
 * Inputs: none
 * Outputs: JSON list of auctions including ID, title, bidCount, dispute details, trends
 * Dependencies: express, logger, @models/auction
 */
router.get('/', async (req, res) => {
  try {
    const auctions = await Auction.find({}, 'id title bidCount disputeDetails bidTrends').sort({ createdAt: -1 });
    res.json({ auctions });
  } catch (error) {
    logger.error('Judge auction data fetch failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;