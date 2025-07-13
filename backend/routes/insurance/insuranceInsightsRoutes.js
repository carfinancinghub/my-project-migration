// File: insuranceInsightsRoutes.js
// Path: backend/routes/insurance/insuranceInsightsRoutes.js
// Author: Cod2 05051047
// 👑 Crown Certified

const express = require('express');
const router = express.Router();

router.get('/insights', (req, res) => {
  res.status(200).json({
    policyCount: 1200,
    claimsRatio: 0.23,
    liabilityHeatmap: [
      { region: 'West', risk: 'Low' },
      { region: 'East', risk: 'Moderate' },
      { region: 'Midwest', risk: 'High' },
    ],
  });
});

module.exports = router;
