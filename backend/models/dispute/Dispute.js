// File: Dispute.js
// Path: backend/models/dispute/Dispute.js

const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  judgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vote: {
    type: String,
    enum: ['Yes', 'No', 'Neutral'],
    required: true,
  },
  comment: {
    type: String,
    maxlength: 1000,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const disputeSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'transactionModel', // flexible binding to auction, delivery, etc.
  },
  transactionModel: {
    type: String,
    required: true,
    enum: ['Auction', 'Delivery', 'LoanOffer', 'Payment'],
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  againstUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
    required: true,
    maxlength: 3000,
  },
  status: {
    type: String,
    enum: ['Open', 'Voting', 'Resolved', 'Escalated'],
    default: 'Open',
  },
  judgePool: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  votes: [voteSchema],
  resolution: {
    type: String,
    maxlength: 3000,
  },
  resolvedAt: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Dispute', disputeSchema);
