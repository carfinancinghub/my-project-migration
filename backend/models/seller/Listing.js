// File: Listing.js
// Path: server/models/Listing.js

const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  watchlistCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Sold', 'Pending'],
    default: 'Active',
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Listing', listingSchema);
