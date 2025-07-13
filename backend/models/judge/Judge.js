// File: Judge.js
// Path: backend/models/judge/Judge.js
// Purpose: Define Mongoose schema for platform judges involved in arbitration and dispute resolution
// Author: Cod2
// Date: 2025-04-28

const mongoose = require('mongoose');

// Define schema for platform judges
const judgeSchema = new mongoose.Schema(
  {
    // Link to user account
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Display name for judge
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Areas of platform expertise (e.g., seller, lender, buyer, hauler)
    expertise: {
      type: [String],
      default: [],
    },

    // Total number of disputes the judge has voted on
    casesHandled: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Judge's overall rating (community-driven or admin-reviewed)
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },

    // Badges assigned to this judge (e.g., Bronze, Silver, Gold)
    badgeLevel: {
      type: String,
      enum: ['None', 'Bronze', 'Silver', 'Gold'],
      default: 'None',
    },

    // Whether this judge is currently allowed to vote
    verified: {
      type: Boolean,
      default: false,
    },

    // Account status for moderation purposes
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Retired'],
      default: 'Active',
    },

    // List of past disputes the judge voted on (future cross-reference)
    disputesVotedOn: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dispute',
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Includes createdAt and updatedAt
  }
);

// Export the model
module.exports = mongoose.model('Judge', judgeSchema);
