// File: transportController.js
// Path: backend/controllers/transportController.js

const TransportJob = require('../../server/models/TransportJob');

// Get all jobs for current hauler
exports.getMyTransportJobs = async (req, res) => {
  try {
    const jobs = await TransportJob.find({ haulerId: req.user._id })
      .populate('carId')
      .populate('pickupLocation')
      .populate('dropoffLocation')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transport jobs' });
  }
};

// Create a transport job (admin or escrow-triggered)
exports.createTransportJob = async (req, res) => {
  try {
    const job = new TransportJob({
      ...req.body,
      status: 'Pending'
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create transport job' });
  }
};

// Update job status (e.g., In Transit, Delivered)
exports.updateTransportStatus = async (req, res) => {
  try {
    const job = await TransportJob.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Transport job not found' });
    if (job.haulerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update transport job' });
  }
};
