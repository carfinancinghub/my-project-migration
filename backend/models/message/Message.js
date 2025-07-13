// File: Message.js
// Path: backend/models/message/Message.js

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: [
      {
        url: String,
        fileType: String, // e.g. "image/png", "application/pdf"
      },
    ],
    disputeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dispute',
    },
    messageType: {
      type: String,
      enum: ['text', 'system', 'automated'],
      default: 'text',
    },
    edited: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    deletedBySender: {
      type: Boolean,
      default: false,
    },
    deletedByRecipient: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', MessageSchema);
