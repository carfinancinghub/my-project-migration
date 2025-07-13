// File: auctions.js
// Path: backend/routes/admin/auctions.js
// Purpose: Admin route to retrieve auction data with free and paid tier support
// Author: Cod1 (05111353 - PDT)
// 👑 Cod2 Crown Certified

const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');
const Auction = require('@models/auction');

/**
 * Functions Summary:
 * - GET /api/admin/auctions: Returns auction data (basic + premium fields)
 * Inputs: req.user (used for future RBAC if needed)
 * Outputs: JSON list of auctions with id, title, bidCount (+ anomaly + dispute if enabled)
 * Dependencies: @models/auction, @utils/logger
 */
router.get('/', async (req, res) => {
  try {
    const auctions = await Auction.find({}, 'id title bidCount anomalyFlag disputeStatus').sort({ createdAt: -1 });
    res.json({ auctions });
  } catch (error) {
    logger.error('Failed to fetch admin auction data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;