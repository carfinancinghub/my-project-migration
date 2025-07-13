// File: history.js
// Path: backend/routes/auction/history.js
// Purpose: API route to return user auction history with premium analytics if applicable
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

const express = require('express');
const router = express.Router();
const logger = require('@/utils/logger');

/**
 * ## Functions Summary:
 * - GET /api/auction/history: Returns auction history and optional analytics based on isPremium flag
 * - Inputs: req.query.userId, req.query.isPremium
 * - Outputs: JSON history list (and analytics for premium)
 * - Dependencies: logger
 */

router.get('/history', async (req, res) => {
  const { userId, isPremium } = req.query;

  if (!userId) {
    logger.error('Missing userId in auction history request');
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    // Simulated static data
    const history = [
      { id: 'a1', title: '1970 Dodge Charger', date: '2025-04-20', finalBid: 32000 },
      { id: 'a2', title: '2019 Tesla Model 3', date: '2025-05-01', finalBid: 21000 }
    ];

    const analytics = [
      { label: 'Average Bids', value: 9 },
      { label: 'Highest Final Bid', value: 32000 }
    ];

    if (isPremium === 'true') {
      return res.status(200).json({ history, analytics });
    } else {
      return res.status(200).json({ history });
    }
  } catch (err) {
    logger.error('Failed to fetch auction history:', err);
    return res.status(500).json({ error: 'Server error fetching history' });
  }
});

module.exports = router;
