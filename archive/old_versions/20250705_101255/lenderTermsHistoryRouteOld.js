// File: lenderTermsHistoryRoute.js
// Path: backend/routes/lender/lenderTermsHistoryRoute.js
// 👑 Cod1 Crown Certified

const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');
const { getTermsHistory } = require('@controllers/lender/LenderTermsExporter');
const { protect, checkFeatureAccess } = require('@middleware/authMiddleware');

// GET /api/lenders/terms-history/:userId
router.get('/terms-history/:userId', protect, async (req, res) => {
  const { userId } = req.params;

  try {
    const fullAccess = checkFeatureAccess(req.user, 'lenderExportAnalytics');
    const history = await getTermsHistory(userId, { detailed: fullAccess });

    if (!history) {
      return res.status(404).json({ message: 'No export history found.' });
    }

    res.json(history);
  } catch (err) {
    logger.error(`Failed to fetch lender terms history for ${userId}:`, err);
    res.status(500).json({ message: 'Failed to retrieve export history.' });
  }
});

module.exports = router;
