// File: EscrowContract.js
// Path: server/models/EscrowContract.js

const mongoose = require('mongoose');

const escrowContractSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  contractPDFUrl: {
    type: String, // Link to generated PDF
  },
  signedByBuyer: {
    type: Boolean,
    default: false,
  },
  signedBySeller: {
    type: Boolean,
    default: false,
  },
  signedByLender: {
    type: Boolean,
    default: false,
  },
  activated: {
    type: Boolean,
    default: false,
  },
  effectiveDate: {
    type: Date,
  },
  expirationDate: {
    type: Date,
  },
  termsSummary: {
    type: String,
    maxlength: 3000,
  },
  contractType: {
    type: String,
    enum: ['Non-Recourse', 'Standard', 'Conditional'],
    default: 'Standard',
  },
  isComplete: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('EscrowContract', escrowContractSchema);
