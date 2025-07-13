// File: aiReviewRoute.js
// Path: backend/routes/hauler/aiReviewRoute.js
// 👑 Cod1 Certified — AI Smart Review API Route for Hauler Jobs

const express = require('express');
const router = express.Router();
const Job = require('../../models/Job');
const analyzeHaulerJob = require('../../utils/ai/cod1HaulerReviewAI');
const authenticate = require('../../middleware/authenticate');

// @route   GET /api/hauler/jobs/:jobId/ai-review
// @desc    Analyze job with Cod1 AI Assistant for anomalies or quality flags
// @access  Protected
router.get('/jobs/:jobId/ai-review', authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const analysis = analyzeHaulerJob(job);
    res.json(analysis);
  } catch (err) {
    console.error('AI Review error:', err);
    res.status(500).json({ message: 'Failed to analyze job' });
  }
});

module.exports = router;
