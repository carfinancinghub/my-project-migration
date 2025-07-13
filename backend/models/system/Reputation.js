// File: Reputation.js
// Path: server/models/Reputation.js

const mongoose = require('mongoose');

const reputationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  score: {
    type: Number,
    default: 100,
    min: 0,
    max: 100,
  },
  badges: [
    {
      name: String,
      description: String,
      iconUrl: String,
      awardedAt: {
        type: Date,
        default: Date.now,
      }
    }
  ],
  history: [
    {
      type: {
        type: String,
        enum: ['Transaction', 'Dispute', 'Review', 'Inspection', 'Community'],
        required: true,
      },
      referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      delta: {
        type: Number,
        required: true,
      },
      reason: {
        type: String,
        maxlength: 1000,
      },
      date: {
        type: Date,
        default: Date.now,
      }
    }
  ]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Reputation', reputationSchema);
