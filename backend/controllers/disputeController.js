// File: disputeController.js
// Path: backend/controllers/disputeController.js

const Dispute = require('../../server/models/Dispute');

// Get all disputes involving current user
exports.getMyDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find({
      $or: [
        { createdBy: req.user._id },
        { defendantId: req.user._id },
        { judges: req.user._id }
      ]
    }).sort({ createdAt: -1 });
    res.json(disputes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch disputes' });
  }
};

// Create a new dispute
exports.createDispute = async (req, res) => {
  try {
    const { contractId, title, description, defendantId } = req.body;
    const dispute = new Dispute({
      title,
      description,
      createdBy: req.user._id,
      contractId,
      defendantId,
      status: 'Open'
    });
    await dispute.save();
    res.status(201).json(dispute);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create dispute' });
  }
};

// Admin assigns judges to a dispute
exports.assignJudges = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const { disputeId } = req.params;
    const { judges } = req.body;
    const dispute = await Dispute.findByIdAndUpdate(
      disputeId,
      { judges, status: 'Under Review' },
      { new: true }
    );
    res.json(dispute);
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign judges' });
  }
};

// Judge submits vote
exports.submitVote = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { vote } = req.body;
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });

    if (!dispute.judges.includes(req.user._id)) {
      return res.status(403).json({ error: 'You are not assigned to this dispute' });
    }

    const existing = dispute.votes.find(v => v.judge.toString() === req.user._id.toString());
    if (existing) return res.status(409).json({ error: 'You already voted' });

    dispute.votes.push({ judge: req.user._id, vote });
    await dispute.save();
    res.json(dispute);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit vote' });
  }
};
