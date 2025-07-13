// 👑 Crown Certified Route — auctions.js
// Path: backend/routes/buyer/auctions.js
// Purpose: Buyer auction history + real-time bids from lenders/service providers with analytics and AI.
// Author: Rivers Auction Team — May 15, 2025

const express = require('express');
const router = express.Router();
const logger = require('@/utils/logger');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validateQueryParams = require('@/utils/validateQueryParams');
const Auction = require('@/models/Auction');
const BidService = require('@/services/auction/BidService');
const BidRecommender = require('@/services/ai/BidRecommender');

router.use(helmet());
router.use(rateLimit({ windowMs: 60 * 1000, max: 30 }));

/**
 * @route   GET /api/buyer/auctions
 * @desc    Returns buyer auction history, available bids, and optional premium insights.
 * @query   buyerId (string, required), isPremium (boolean, optional)
 * @access  Public (auth enforced upstream if needed)
 */
router.get('/', async (req, res) => {
  const { buyerId, isPremium } = req.query;

  if (!buyerId) {
    return res.status(400).json({ error: 'Missing required parameter: buyerId' });
  }

  try {
    const auctions = await Auction.find({ buyerId }).sort({ updatedAt: -1 });

    const history = await Promise.all(
      auctions.map(async (a) => {
        const bids = await BidService.getBidsForAuction(a._id);
        return {
          auctionId: a._id,
          carId: a.carId,
          status: a.status,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
          won: a.status === 'Funded' || a.status === 'Closed',
          availableBids: bids.map((b) => ({
            providerType: b.providerType, // 'lender' | 'hauler' | etc.
            amount: b.amount,
            interestRate: b.interestRate,
            estimatedDelivery: b.estimatedDelivery,
            providerId: b.providerId,
            timestamp: b.createdAt,
          })),
        };
      })
    );

    const response = { history };

    if (isPremium === 'true') {
      const totalBids = history.reduce((sum, h) => sum + h.availableBids.length, 0);
      const totalWon = history.filter((h) => h.won).length;
      const avgBids = history.length
        ? (totalBids / history.length).toFixed(2)
        : '0.00';
      const successRate = history.length
        ? ((totalWon / history.length) * 100).toFixed(1)
        : '0.0';

      const recommendations = await BidRecommender.getRecommendedBids(buyerId);

      response.analytics = {
        successRate: `${successRate}%`,
        averageBidsPerAuction: avgBids,
        totalAuctions: history.length,
        totalBidsReceived: totalBids,
      };

      response.recommendations = recommendations;
      response.websocket = `/ws/buyer/${buyerId}/live-bids`; // Reference only
    }

    return res.json(response);
  } catch (error) {
    logger.error('Error retrieving buyer auction dashboard', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;