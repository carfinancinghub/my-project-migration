// File: Notification.js
// Path: backend/models/notification/Notification.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { // changed from userId
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['message', 'system', 'alert', 'info', 'warning', 'success', 'error'], // expanded for badge colors
    default: 'system',
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: null,
  },
  isRead: { // changed from read
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // createdAt and updatedAt auto fields
});

module.exports = mongoose.model('Notification', notificationSchema);
