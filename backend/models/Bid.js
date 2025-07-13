// File: Bid.js
// Path: backend/models/Bid.js

const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  lender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bid', BidSchema);
