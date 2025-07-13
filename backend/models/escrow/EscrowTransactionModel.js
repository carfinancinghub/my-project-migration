// File: EscrowTransactionModel.js
// Path: backend/models/escrow/EscrowTransactionModel.js
// Author: Cod2 (05071958)
// Description: Schema for escrow transaction tracking

const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  description: String,
  met: Boolean,
});

const escrowSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  method: { type: String, default: 'Wire' },
  status: { type: String, default: 'Pending' },
  conditions: [conditionSchema],
  auditLog: Array,
  depositDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('EscrowTransaction', escrowSchema);
