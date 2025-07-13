// File: HaulerRequest.js
// Path: backend/models/haulder/HaulerRequest.js
// 👑 Cod1 Crown Certified — Hauler Request Model with Status Tracking & GeoPin Proof

const mongoose = require('mongoose');

const haulerRequestSchema = new mongoose.Schema({
  vehicle: {
    make: String,
    model: String,
    year: Number,
  },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in transit', 'delivered', 'flagged'],
    default: 'pending',
  },
  notes: { type: String },
  geoPin: { type: String }, // e.g., "37.7749,-122.4194"
  flagged: { type: Boolean, default: false },
  flaggedReason: { type: String },
  hauler: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HaulerRequest', haulerRequestSchema);