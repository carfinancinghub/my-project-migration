// File: haulerRoutes.js
// Path: backend/routes/hauler/haulerRoutes.js
// 📃 Handles hauler delivery assignments, proof submission, and status updates

const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const HaulerRequest = require('../../models/hauler/HaulerRequest');

// GET: All hauler requests (admin or hauler view)
router.get('/', protect, async (req, res) => {
  try {
    const jobs = await HaulerRequest.find().populate('vehicle buyer seller hauler');
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching hauler requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: My jobs (for logged-in hauler)
router.get('/my-jobs', protect, async (req, res) => {
  try {
    const jobs = await HaulerRequest.find({ hauler: req.user.id });
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching my jobs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Accept job
router.post('/:id/accept', protect, async (req, res) => {
  try {
    const job = await HaulerRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status !== 'Pending') return res.status(400).json({ message: 'Job already in progress or complete' });
    job.status = 'In Transit';
    job.hauler = req.user.id;
    await job.save();
    res.json(job);
  } catch (err) {
    console.error('Accept job error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Mark as complete
router.post('/:id/complete', protect, async (req, res) => {
  try {
    const job = await HaulerRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.hauler.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    job.status = 'Delivered';
    await job.save();
    res.json({ message: 'Delivery marked complete', job });
  } catch (err) {
    console.error('Completion error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
