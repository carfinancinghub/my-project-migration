// File: Delivery.js
// Path: server/models/Delivery.js

const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true,
  },
  haulerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  dropoffLocation: {
    type: String,
    required: true,
  },
  currentStatus: {
    type: String,
    enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  scheduledPickupDate: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  mechanicInspectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inspection',
  },
  gpsProof: {
    type: String, // URL or file path
  },
  notes: {
    type: String,
    maxlength: 2000,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Delivery', deliverySchema);
