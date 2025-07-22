const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({ car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true }, seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, startPrice: { type: Number, required: true }, currentBid: { type: Number }, status: { type: String, enum: ['open', 'closed', 'pending'], default: 'open' }, createdAt: { type: Date, default: Date.now }, endsAt: { type: Date, required: true }, });

module.exports = mongoose.model('Auction', auctionSchema);