// File: EscrowAPIController.js
// Path: backend/controllers/escrow/EscrowAPIController.js
// Author: Cod2 (05071958)
// Description: Controller logic for escrow deposit, release, refund, and checklist updates.

const { logAction } = require('@/utils/escrow/EscrowAuditLogStore');
const Escrow = require('@/models/escrow/EscrowTransactionModel');

const deposit = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const tx = await Escrow.findByIdAndUpdate(transactionId, {
      status: 'Deposited',
      depositDate: new Date(),
    }, { new: true });
    logAction(transactionId, req.user.email, 'Deposited funds');
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: 'Deposit failed' });
  }
};

const release = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const tx = await Escrow.findByIdAndUpdate(transactionId, {
      status: 'Released',
    }, { new: true });
    logAction(transactionId, req.user.email, 'Released funds');
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: 'Release failed' });
  }
};

const refund = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const tx = await Escrow.findByIdAndUpdate(transactionId, {
      status: 'Refunded',
    }, { new: true });
    logAction(transactionId, req.user.email, 'Issued refund');
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: 'Refund failed' });
  }
};

const updateConditions = async (req, res) => {
  const { escrowId } = req.params;
  const { conditions } = req.body;
  try {
    const tx = await Escrow.findByIdAndUpdate(escrowId, {
      conditions,
    }, { new: true });
    logAction(escrowId, req.user.email, 'Updated conditions');
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: 'Checklist update failed' });
  }
};

module.exports = { deposit, release, refund, updateConditions };
