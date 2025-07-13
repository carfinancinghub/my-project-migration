// File: EscrowTransaction.js
// Path: server/models/EscrowTransaction.js

const mongoose = require('mongoose');

const escrowTransactionSchema = new mongoose.Schema({
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EscrowContract',
    required: true,
  },
  step: {
    type: String,
    enum: [
      'Deposit Received',
      'Buyer Inspection Scheduled',
      'Buyer Inspection Approved',
      'Funds Released to Seller',
      'Funds Released to Mechanic',
      'Funds Released to Hauler',
      'Refunded to Buyer',
      'Platform Fee Processed'
    ],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD'
  },
  triggeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    maxlength: 2000,
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('EscrowTransaction', escrowTransactionSchema);
