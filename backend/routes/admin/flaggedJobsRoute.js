// File: flaggedJobsRoute.js
// Path: backend/routes/admin/flaggedJobsRoute.js
// 👑 Cod1 Crown Certified — Admin API Route to Fetch Flagged Delivery Jobs

const express = require('express');
const router = express.Router();
const Job = require('../../models/Job');
const authenticate = require('../../middleware/authenticate');
const authorizeAdmin = require('../../middleware/authorizeAdmin');

// @route   GET /api/admin/flagged-jobs
// @desc    Fetch all jobs flagged for dispute or review
// @access  Admin Only
router.get('/flagged-jobs', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const flaggedJobs = await Job.find({ isFlagged: true }).sort({ updatedAt: -1 });
    res.json(flaggedJobs);
  } catch (err) {
    console.error('Error fetching flagged jobs:', err);
    res.status(500).json({ message: 'Server error retrieving flagged jobs.' });
  }
});

module.exports = router;
