// File: escrowController.js
// Path: backend/controllers/escrowController.js

const EscrowContract = require('../../server/models/EscrowContract');
const EscrowTransaction = require('../../server/models/EscrowTransaction');

// Get all contracts for a user (buyer/seller/lender)
exports.getMyEscrowContracts = async (req, res) => {
  try {
    const contracts = await EscrowContract.find({
      $or: [
        { buyerId: req.user._id },
        { sellerId: req.user._id },
        { lenderId: req.user._id }
      ]
    }).sort({ createdAt: -1 });
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
};

// Create a new escrow contract
exports.createEscrowContract = async (req, res) => {
  try {
    const contract = new EscrowContract({
      ...req.body,
      activated: false,
      isComplete: false
    });
    await contract.save();
    res.status(201).json(contract);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create contract' });
  }
};

// Mark a contract as signed (buyer/lender/seller)
exports.signEscrowContract = async (req, res) => {
  try {
    const contract = await EscrowContract.findById(req.params.contractId);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    if (req.user._id.equals(contract.buyerId)) contract.signedByBuyer = true;
    if (req.user._id.equals(contract.sellerId)) contract.signedBySeller = true;
    if (contract.lenderId && req.user._id.equals(contract.lenderId)) contract.signedByLender = true;

    // Auto-activate if everyone signed
    if (contract.signedByBuyer && contract.signedBySeller && (contract.lenderId ? contract.signedByLender : true)) {
      contract.activated = true;
      contract.effectiveDate = new Date();
    }

    await contract.save();
    res.json(contract);
  } catch (err) {
    res.status(500).json({ error: 'Failed to sign contract' });
  }
};

// POST a transaction to an escrow contract
exports.logEscrowTransaction = async (req, res) => {
  try {
    const { contractId, step, amount, currency, notes } = req.body;
    const transaction = new EscrowTransaction({
      contractId,
      step,
      amount,
      currency,
      notes,
      triggeredBy: req.user._id
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record transaction' });
  }
};
