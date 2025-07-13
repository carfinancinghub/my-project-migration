// 👑 Cod2 Crown Certified
// File: history.js
// Path: backend/routes/auctions/history.js
// Purpose: Route to retrieve auction history with premium analytics
// Author: Rivers Auction Team
// Date: May 12, 2025

const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');

/**
 * ## Functions Summary:
 * - GET /api/auctions/history:
 *   - Purpose: Fetch auction history with optional premium analytics.
 *   - Inputs:
 *     - req.query.userId (string): ID of the user requesting history.
 *     - req.query.isPremium (string): "true" if user has premium access.
 *   - Outputs:
 *     - HTTP 200: JSON array of auction history records.
 *     - HTTP 400: If userId is missing.
 *     - HTTP 500: If internal error occurs.
 *   - Dependencies:
 *     - @utils/logger
 */

router.get('/history', async (req, res) => {
  const { userId, isPremium } = req.query;

  if (!userId) {
    logger.error('Missing userId in auction history request');
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    // Mock history data
    const basicHistory = [
      { auctionId: 'A1', title: '2019 Ford F-150', finalBid: 18200, date: '2024-11-02' },
      { auctionId: 'A2', title: '2020 Honda Civic', finalBid: 15600, date: '2024-12-15' }
    ];

    if (isPremium === 'true') {
      const premiumData = basicHistory.map(entry => ({
        ...entry,
        bidTrend: 'Upward',
        revisits: Math.floor(Math.random() * 5 + 1),
        engagementIndex: `${Math.floor(Math.random() * 80 + 20)}%`
      }));
      return res.status(200).json(premiumData);
    }

    return res.status(200).json(basicHistory);
  } catch (err) {
    logger.error('Error retrieving auction history:', err);
    return res.status(500).json({ error: 'Failed to retrieve auction history' });
  }
});

module.exports = router;