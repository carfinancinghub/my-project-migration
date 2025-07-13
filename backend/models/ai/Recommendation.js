// File: Recommendation.js
// Path: backend/models/ai/Recommendation.js
// 👑 Cod1 Crown Certified — AI Recommendation Model

const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  suggestion: {
    type: String,
    required: true,
  },
  relatedTags: [{
    type: String,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
