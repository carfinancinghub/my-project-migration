// File: submitFeedbackRoutes.js
// Path: backend/routes/mechanic/submitFeedbackRoutes.js
// Author: Cod1 (05061800)
// Description: Stores mechanic feedback with optional AI sentiment (premium)

const express = require('express');
const router = express.Router();
const { logMechanicFeedback } = require('@controllers/mechanic/MechanicFeedbackLogger');

// @route POST /api/mechanic/submit-feedback
router.post('/api/mechanic/submit-feedback', async (req, res) => {
  try {
    await logMechanicFeedback(req.body, req.user); // Gating inside controller
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log feedback.' });
  }
});

module.exports = router;
