// File: LoanOffer.js
// Path: server/models/LoanOffer.js

const mongoose = require('mongoose');

const loanOfferSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true,
  },
  lenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  downPayment: {
    type: Number,
    required: true,
    min: 0,
  },
  loanAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  termMonths: {
    type: Number,
    required: true,
    min: 1,
  },
  requiresIncomeVerification: {
    type: Boolean,
    default: false,
  },
  requiresCreditCheck: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isAcceptedByBuyer: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    maxlength: 2000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('LoanOffer', loanOfferSchema);
