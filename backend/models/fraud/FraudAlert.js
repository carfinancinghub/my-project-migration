// File: FraudAlert.js
// Path: backend/models/fraud/FraudAlert.js
// 👑 Cod1 Crown Certified — Fraud Alert Model

const mongoose = require('mongoose');

const FraudAlertSchema = new mongoose.Schema({
  reporter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reportedUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  description: { 
    type: String, 
    required: true, 
    maxlength: 3000 
  },
  alertType: { 
    type: String, 
    enum: ['payment', 'delivery', 'inspection', 'identity', 'other'], 
    default: 'other' 
  },
  status: { 
    type: String, 
    enum: ['open', 'under_review', 'resolved', 'dismissed'], 
    default: 'open' 
  },
  evidenceUrls: [{ 
    type: String 
  }],
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // Admin reviewer
  },
  resolutionNotes: { 
    type: String, 
    maxlength: 3000 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FraudAlert', FraudAlertSchema);
