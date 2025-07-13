// File: disputes.js
// Path: backend/routes/disputes.js

const express = require('express');
const router = express.Router();
// Import auth middleware (renamed protect for clarity)
const protect = require('../middleware/auth');
// Import the Dispute model
const Dispute = require('../models/Dispute');

// GET all disputes (protected)
router.get('/', protect, async (req, res) => {
  try {
    const disputes = await Dispute.find();
    res.json(disputes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH resolve a dispute (protected)
router.patch('/:id/resolve', protect, async (req, res) => {
  try {
    const { resolution } = req.body;
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }
    dispute.status = 'resolved';
    dispute.resolution = resolution;
    await dispute.save();
    res.json(dispute);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Resolution failed' });
  }
});

module.exports = router;
