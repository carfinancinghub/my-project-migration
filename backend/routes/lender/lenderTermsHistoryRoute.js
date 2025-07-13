// backend/routes/lenderTermsHistoryRoute.js
const express = require('express');
const router = express.Router();
const LenderTermsExporter = require('@controllers/lender/LenderTermsExporter');

// GET /api/lender/terms-history/:userId
router.get('/terms-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const options = req.query; // e.g., { limit: 10, sort: 'desc' }

    const history = await LenderTermsExporter.getTermsHistory(userId, options);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/lender/export-terms
router.post('/export-terms', async (req, res) => {
  try {
    await LenderTermsExporter.exportLenderTerms(req, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
