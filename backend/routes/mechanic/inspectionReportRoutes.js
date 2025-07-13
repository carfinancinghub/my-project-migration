// File: inspectionReportRoutes.js
// Path: backend/routes/mechanic/inspectionReportRoutes.js
// Author: Cod1 (05061758)
// Description: Returns inspection report data for a given task ID

const express = require('express');
const router = express.Router();
const { generateReport } = require('@utils/mechanic/MechanicInspectionReportBuilder');

// @route GET /api/mechanic/report/:taskId
// @desc  Get full inspection report (gated for premium)
router.get('/api/mechanic/report/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    const report = await generateReport(taskId, req.user); // checks premium inside builder
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inspection report.' });
  }
});

module.exports = router;
