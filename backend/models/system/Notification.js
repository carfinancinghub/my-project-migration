// File: Notification.js
// Path: server/models/Notification.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'System',
      'Message',
      'DisputeUpdate',
      'LoanUpdate',
      'InspectionUpdate',
      'DeliveryUpdate',
      'AuctionActivity',
      'PaymentStatus',
      'BadgeEarned'
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  message: {
    type: String,
    maxlength: 2000,
  },
  link: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);
