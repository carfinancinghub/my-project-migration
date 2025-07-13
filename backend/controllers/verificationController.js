// File: verificationController.js
// Path: backend/controllers/verificationController.js

const Verification = require('../../server/models/Verification');

// Get verification info for the current user
exports.getMyVerification = async (req, res) => {
  try {
    const record = await Verification.findOne({ userId: req.user._id });
    if (!record) return res.status(404).json({ error: 'No verification record found.' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch verification data.' });
  }
};

// Update a user's verification info (admin only)
exports.updateVerificationByAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const updated = await Verification.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update verification status.' });
  }
};
