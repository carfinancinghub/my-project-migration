// File: predictRepairCostRoutes.js
// Path: backend/routes/mechanic/predictRepairCostRoutes.js
// Author: Cod1 (05061801)
// Description: Returns AI-estimated repair cost for a given inspection task

const express = require('express');
const router = express.Router();
const { predictRepairCost } = require('@utils/mechanic/RepairCostPredictor');

// @route POST /api/mechanic/predict-repair-cost
router.post('/api/mechanic/predict-repair-cost', async (req, res) => {
  try {
    const result = await predictRepairCost(req.body.taskId, req.user);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
