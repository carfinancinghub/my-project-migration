// File: disputeFlowController.js
// Path: backend/controllers/disputes/disputeFlowController.js
// 👑 Cod1 Crown Certified — Dispute Lifecycle Management

const Dispute = require('@/models/dispute/Dispute');
const { triggerDisputeNotification } = require('@/utils/notificationTrigger');

// Create a new dispute
exports.createDispute = async (req, res) => {
  try {
    const { raisedBy, againstUser, description, transactionId, transactionModel } = req.body;

    const newDispute = new Dispute({
      raisedBy,
      againstUser,
      description,
      transactionId,
      transactionModel,
      status: 'Open',
      timeline: [{ event: 'Dispute Created', timestamp: new Date() }]
    });

    await newDispute.save();

    await triggerDisputeNotification({
      type: 'Dispute Created',
      disputeId: newDispute._id,
      recipientId: [raisedBy, againstUser],
      message: `🚨 A new dispute has been filed.`,
      suppressDuplicates: true,
    });

    res.status(201).json(newDispute);
  } catch (err) {
    console.error('Create dispute error:', err);
    res.status(500).json({ message: 'Failed to create dispute' });
  }
};

// Get all disputes related to a user
exports.getDisputesByUser = async (req, res) => {
  try {
    const disputes = await Dispute.find({
      $or: [{ raisedBy: req.params.userId }, { againstUser: req.params.userId }],
    });

    res.json(disputes);
  } catch (err) {
    console.error('Fetch user disputes error:', err);
    res.status(500).json({ message: 'Server error fetching disputes' });
  }
};

// Get all disputes (admin view)
exports.getAllDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find();
    res.json(disputes);
  } catch (err) {
    console.error('Fetch all disputes error:', err);
    res.status(500).json({ message: 'Server error fetching disputes' });
  }
};

// Admin: Manually resolve a dispute
exports.resolveDisputeManually = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    const dispute = await Dispute.findById(id);
    if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

    dispute.status = 'Resolved';
    dispute.resolution = resolution;
    dispute.timeline.push({
      event: 'Manual Resolution',
      value: resolution,
      timestamp: new Date()
    });

    await dispute.save();

    await triggerDisputeNotification({
      type: 'Dispute Resolved',
      disputeId: id,
      recipientId: [dispute.raisedBy, dispute.againstUser],
      message: `✅ Dispute ${id} was resolved manually.`,
      suppressDuplicates: true,
    });

    res.json(dispute);
  } catch (err) {
    console.error('Manual dispute resolution error:', err);
    res.status(500).json({ message: 'Failed to resolve dispute manually' });
  }
};
