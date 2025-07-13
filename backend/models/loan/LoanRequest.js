// File: LoanRequest.js
// Path: backend/models/loan/LoanRequest.js
// 👑 Cod1 Crown Certified — Supreme Loan Request Model

const mongoose = require('mongoose');

const LoanRequestSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  requestedAmount: { type: Number, required: true },
  downPayment: { type: Number, default: 0 },
  creditScore: { type: Number },
  loanType: {
    type: String,
    enum: ['fico', 'equity', 'ira', 'other'],
    default: 'fico'
  },
  purpose: {
    type: String,
    enum: ['purchase', 'refinance', 'business', 'fleet', 'other'],
    default: 'purchase'
  },
  matchingScore: { type: Number, default: 0 }, // Future AI scoring
  status: {
    type: String,
    enum: ['open', 'matched', 'funded', 'rejected'],
    default: 'open'
  },
  notes: { type: String, maxlength: 3000 }, // Flexible internal notes
}, {
  timestamps: true
});

module.exports = mongoose.model('LoanRequest', LoanRequestSchema);
