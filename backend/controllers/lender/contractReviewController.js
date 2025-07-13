// File: contractReviewController.js
// Path: backend/controllers/lender/contractReviewController.js

const Contract = require('../../models/Contract');
const Notification = require('../../models/Notification');

// GET /api/lender/contracts - fetch all pending contracts
const getContractsForReview = async (req, res) => {
  try {
    const contracts = await Contract.find({ status: 'PendingLenderApproval' })
      .populate('buyer lender');
    res.json(contracts);
  } catch (err) {
    console.error('Error fetching contracts for review:', err);
    res.status(500).json({ error: 'Server error fetching contracts' });
  }
};

// POST /api/lender/contracts/:id/approve
const approveContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    contract.status = 'ApprovedByLender';
    await contract.save();

    await Notification.create({
      userId: contract.buyer,
      type: 'contract-approved',
      message: '✅ Your contract was approved by the lender.',
    });

    res.json({ success: true, message: 'Contract approved.' });
  } catch (err) {
    console.error('Approval error:', err);
    res.status(500).json({ error: 'Server error approving contract' });
  }
};

// POST /api/lender/contracts/:id/reject
const rejectContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    contract.status = 'RejectedByLender';
    await contract.save();

    await Notification.create({
      userId: contract.buyer,
      type: 'contract-rejected',
      message: '❌ Your contract was rejected by the lender.',
    });

    res.json({ success: true, message: 'Contract rejected.' });
  } catch (err) {
    console.error('Rejection error:', err);
    res.status(500).json({ error: 'Server error rejecting contract' });
  }
};

module.exports = {
  getContractsForReview,
  approveContract,
  rejectContract,
};
