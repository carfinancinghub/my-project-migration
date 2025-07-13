// File: LenderReputation.js
// Path: backend/models/hauler/HaulerReputation.js
// 👑 Cod1 Crown Certified — Reputation Ledger for Hauler Performance & History

const mongoose = require('mongoose');

const haulerReputationSchema = new mongoose.Schema({
  haulerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  totalStars: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  recentRatings: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
      rating: Number,
      feedback: String,
      submittedAt: Date,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('HaulerReputation', haulerReputationSchema);
