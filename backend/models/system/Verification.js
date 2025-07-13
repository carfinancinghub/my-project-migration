// File: Verification.js
// Path: server/models/Verification.js

const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  idVerified: {
    type: Boolean,
    default: false,
  },
  dmvVerified: {
    type: Boolean,
    default: false,
  },
  verificationDocs: [
    {
      type: String, // URL or file path
    }
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    maxlength: 2000,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Verification', verificationSchema);
