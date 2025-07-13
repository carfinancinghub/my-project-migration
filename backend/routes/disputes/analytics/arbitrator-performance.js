// 👑 Crown Certified Route — arbitrator-performance.js
// Path: backend/routes/disputes/analytics/arbitrator-performance.js
// Purpose: Returns arbitrator resolution stats, including vote latency, disagreement rate, and gamification badges.
// Author: Rivers Auction Team — May 15, 2025

const express = require('express');
const router = express.Router();
const Dispute = require('@/models/Dispute');
const logger = require('@/utils/logger');
const validateQueryParams = require('@/utils/validateQueryParams');
const AuctionGamificationEngine = require('@/services/auction/AuctionGamificationEngine');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers and rate limiting
router.use(helmet());
router.use(rateLimit({ windowMs: 60 * 1000, max: 30 }));

// GET /api/disputes/analytics/arbitrator/:arbitratorId
router.get('/arbitrator/:arbitratorId', async (req, res) => {
  const { arbitratorId } = req.params;
  const isPremium = req.query.isPremium === 'true';

  try {
    const disputes = await Dispute.find({ 'votes.arbitratorId': arbitratorId });

    const totalDisputes = disputes.length;
    const resolvedCases = disputes.filter(d => d.status === 'Resolved').length;

    const avgResolutionTime = (() => {
      const times = disputes
        .map(d => d.resolvedAt && d.createdAt && (new Date(d.resolvedAt) - new Date(d.createdAt)) / 3600000)
        .filter(Boolean);
      return times.length ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2) : 0;
    })();

    const agreementRate = (() => {
      let aligned = 0;
      disputes.forEach(d => {
        const votes = d.votes || [];
        const majority = findMajorityVote(votes);
        const arbVote = votes.find(v => v.arbitratorId === arbitratorId)?.vote;
        if (arbVote && arbVote.toLowerCase() === majority?.toLowerCase()) aligned++;
      });
      return totalDisputes ? ((aligned / totalDisputes) * 100).toFixed(1) : 0;
    })();

    const premiumMetrics = {};

    if (isPremium) {
      // Peer Disagreement Rate
      const disagreementCount = disputes.reduce((count, d) => {
        const votes = d.votes || [];
        const majority = findMajorityVote(votes);
        const userVote = votes.find(v => v.arbitratorId === arbitratorId)?.vote;
        return userVote && userVote.toLowerCase() !== majority?.toLowerCase() ? count + 1 : count;
      }, 0);
      const disagreementRate = totalDisputes ? ((disagreementCount / totalDisputes) * 100).toFixed(1) : 0;

      // First Vote Latency
      const firstVoteLatency = (() => {
        const latencies = disputes
          .map(d => {
            const vote = d.votes.find(v => v.arbitratorId === arbitratorId);
            return vote?.createdAt && d.createdAt
              ? (new Date(vote.createdAt) - new Date(d.createdAt)) / 3600000
              : null;
          })
          .filter(v => v !== null);
        return latencies.length ? (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2) : 0;
      })();

      // Gamified Badges
      const gamified = await AuctionGamificationEngine.getBadgeSummary('arbitrator', arbitratorId);

      premiumMetrics.firstVoteLatency = firstVoteLatency;
      premiumMetrics.disagreementRate = disagreementRate;
      premiumMetrics.badges = gamified?.badges || [];
    }

    return res.json({
      totalDisputes,
      resolvedCases,
      avgResolutionTime,
      agreementRate,
      ...(isPremium ? premiumMetrics : {}),
    });
  } catch (err) {
    logger.error('Error in arbitrator analytics route', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Utility to find majority vote from votes array
function findMajorityVote(votes = []) {
  const count = {};
  votes.forEach(({ vote }) => {
    const key = vote?.toLowerCase();
    if (key) count[key] = (count[key] || 0) + 1;
  });
  return Object.keys(count).reduce((a, b) => (count[a] > count[b] ? a : b), null);
}

module.exports = router;