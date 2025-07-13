// File: shareReport.js
// Path: backend/routes/mechanic/shareReport.js
// Author: Cod1 (05061620)
// Description: Shares mechanic report via secure link for buyers/sellers
const express = require('express');
const router = express.Router();
const { generateSecureLink } = require('@utils/mechanic/ReportSharer');
router.post('/api/mechanic/share-report/:taskId', async (req, res) => {
  const { taskId } = req.params;
  if (!req.user || !req.user.subscription.includes('reportSharingPremium')) {
    return res.status(403).json({ error: 'Premium feature required' });
  }
  try {
    const link = await generateSecureLink(taskId);
    res.json({ success: true, link });
  } catch (err) {
    res.status(500).json({ error: 'Failed to share report' });
  }
});
module.exports = router;