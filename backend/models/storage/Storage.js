// File: Storage.js
// Path: server/models/storag/Storage.js

const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Indoor', 'Outdoor', 'Climate-Controlled'],
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  dailyRate: {
    type: Number,
    required: true,
    min: 0,
  },
  amenities: [
    {
      type: String,
    }
  ],
  images: [
    {
      type: String,
    }
  ],
  description: {
    type: String,
    maxlength: 3000,
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Storage', storageSchema);
