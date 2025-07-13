// File: Payment.js
// Path: server/models/Payment.js

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    enum: ['Escrow Deposit', 'Seller Payout', 'Transport Fee', 'Inspection Fee', 'Refund', 'Platform Fee'],
    required: true,
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'relatedEntityType',
  },
  relatedEntityType: {
    type: String,
    enum: ['Auction', 'Delivery', 'Inspection', 'Dispute'],
    required: true,
  },
  payerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  payeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  method: {
    type: String,
    enum: ['Stripe', 'ACH', 'Credit Card', 'Crypto', 'Manual'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  processedAt: {
    type: Date,
  },
  notes: {
    type: String,
    maxlength: 2000,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
