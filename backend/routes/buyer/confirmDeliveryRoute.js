// File: confirmDeliveryRoute.js
// Path: backend/routes/buyer/confirmDeliveryRoute.js
// 👑 Cod1 Certified — Final Confirmation Route for Buyer Acceptance

const express = require('express');
const router = express.Router();
const Job = require('../../models/Job');
const authenticate = require('../../middleware/authenticate');

// @route   PATCH /api/buyer/confirm-delivery/:jobId
// @desc    Mark job as buyer-confirmed
// @access  Protected (Buyer)
router.patch('/confirm-delivery/:jobId', authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found.' });

    job.buyerConfirmed = true;
    job.confirmedAt = new Date();
    job.status = 'DeliveredConfirmed';
    await job.save();

    res.json({ message: '✅ Delivery confirmed.', job });
  } catch (err) {
    console.error('Buyer confirmation error:', err);
    res.status(500).json({ message: 'Server error confirming delivery.' });
  }
});

module.exports = router;
