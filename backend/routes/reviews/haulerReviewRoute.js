// File: haulerReviewRoute.js
// Path: backend/routes/reviews/haulerReviewRoute.js
// 👑 Cod1 Crown Certified — Hauler Rating & Feedback Submission Endpoint

const express = require('express');
const router = express.Router();
const Job = require('../../models/Job');
const authenticate = require('../../middleware/authenticate');
const { updateHaulerReputation } = require('../../controllers/hauler/haulerReputationController');

// @route   POST /api/reviews/hauler/:jobId
// @desc    Submit a rating and comment about the hauler
// @access  Protected (Buyer)
router.post('/hauler/:jobId', authenticate, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5 stars.' });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found.' });

    job.haulerReview = {
      rating,
      feedback,
      submittedBy: req.user.id,
      submittedAt: new Date(),
    };
    await job.save();

    // Update hauler reputation stats
    await updateHaulerReputation({
      haulerId: job.hauler,
      jobId: job._id,
      rating,
      feedback,
    });

    res.json({ message: '✅ Review submitted successfully.', review: job.haulerReview });
  } catch (err) {
    console.error('Hauler review error:', err);
    res.status(500).json({ message: 'Server error submitting hauler review.' });
  }
});

module.exports = router;
