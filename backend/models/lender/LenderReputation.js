// File: LenderReputation.js
// Path: backend/models/lender/LenderReputation.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
}, {
  timestamps: true // Automatically add createdAt/updatedAt for each review
});

const lenderReputationSchema = new mongoose.Schema({
  lender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  rating: { type: Number, default: 0 }, // Average rating
  reviews: [reviewSchema],
  disputes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dispute' }],
}, {
  timestamps: true // Automatically add createdAt/updatedAt for reputation
});

module.exports = mongoose.model('LenderReputation', lenderReputationSchema);
