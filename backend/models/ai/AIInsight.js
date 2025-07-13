// File: AIInsight.js
// Path: backend/models/ai/AIInsight.js
// 👑 Cod1 Crown Certified — AI Insight Model for Listings

const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing', // or 'Car' if your listing model is called Car
    required: true,
  },
  titleSuggestion: {
    type: String,
    maxlength: 200,
  },
  descriptionSuggestion: {
    type: String,
    maxlength: 3000,
  },
  tagsSuggestion: [{
    type: String,
    maxlength: 50,
  }],
  aiScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0, // How strong or confident the AI suggestion is
  },
  insights: [{
    type: String,
    maxlength: 1000,
  }],
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('AIInsight', aiInsightSchema);
