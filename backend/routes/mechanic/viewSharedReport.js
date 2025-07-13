// File: viewSharedReport.js
// Path: backend/routes/mechanic/viewSharedReport.js
// Author: Cod1 (05061710)
// Description: Endpoint to view mechanic report via secure token

const express = require('express');
const router = express.Router();
const { verifySharedToken } = require('@utils/mechanic/ReportSharer');

router.get('/api/mechanic/view-shared-report/:token', async (req, res) => {
  try {
    const report = await verifySharedToken(req.params.token);
    if (!report) return res.status(404).json({ error: 'Invalid token' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve report' });
  }
});

module.exports = router;
