/**
 * File: LenderExport.js
 * Path: backend/models/lender/LenderExport.js
 * Purpose: Mongoose model for tracking lender export history
 * 👑 Cod1 Crown Certified
 */

const mongoose = require('mongoose');

const LenderExportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  rate: {
    type: Number,
    required: false
  },
  term: {
    type: String,
    required: false
  },
  negotiationOutcome: {
    type: String,
    required: false
  },
  format: {
    type: String,
    enum: ['csv', 'pdf'],
    default: 'csv'
  }
});

module.exports = mongoose.model('LenderExport', LenderExportSchema);
