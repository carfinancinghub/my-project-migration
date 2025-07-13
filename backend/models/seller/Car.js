// File: Car.js
// Path: backend/models/Car.js
// 👑 Cod1 Crown Certified — Hybrid-Class Schema Benchmark: Auction + Marketplace + Compliance Ready

const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true, min: 1886 },
  price: { type: Number, required: true, min: 0 },
  mileage: { type: Number, default: 0 },
  vin: { type: String, unique: true, sparse: true, trim: true },
  images: [{ type: String }],
  location: { type: String },
  description: { type: String, trim: true, maxlength: 3000 },
  tags: [String],
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Pending Review', 'Sold', 'Under Auction'],
    default: 'Available',
  },
  needsReview: { type: Boolean, default: true },
  dateListed: { type: Date, default: Date.now },

  // 🆕 Cod1 Upgrades Below
  isPublic: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  featureExpiresAt: { type: Date },
  conditionGrade: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Good',
  },
  auctionEnabled: { type: Boolean, default: false },
  reservePrice: { type: Number },
  views: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
}, {
  timestamps: true // includes createdAt + updatedAt
});

module.exports = mongoose.model('Car', carSchema);
