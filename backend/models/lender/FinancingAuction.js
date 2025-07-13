const mongoose = require('mongoose');

const FinancingAuctionSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidHistory: [
    {
      lenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      interestRate: { type: Number, required: true },
      proposedDownPayment: { type: Number, required: true },
      termMonths: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  selectedBid: String,
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FinancingAuction', FinancingAuctionSchema);