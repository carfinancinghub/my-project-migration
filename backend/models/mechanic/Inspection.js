// File: Inspection.js
// Path: server/models/Inspection.js

const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  mechanicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  inspectionDate: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Flagged'],
    default: 'Pending',
  },
  findings: {
    type: String,
    maxlength: 3000,
  },
  images: [
    {
      type: String, // URLs or file paths
    }
  ],
  reportURL: {
    type: String, // downloadable PDF or hosted report
  },
  notes: {
    type: String,
    maxlength: 2000,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Inspection', inspectionSchema);
