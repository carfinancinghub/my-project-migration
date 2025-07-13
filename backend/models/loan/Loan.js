// File: Loan.js
// Path: backend/models/loan/Loan.js

const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  termMonths: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'funded'],
    default: 'pending'
  },
  fundedAt: { type: Date },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Loan', LoanSchema);
