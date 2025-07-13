// File: Contract.js
// Path: backend/models/contract/Contract.js
// 👑 Cod1 Crown Certified — Smart Contract Model

const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  loan: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }, // optional if financed
  contractType: {
    type: String,
    enum: ['purchase', 'service', 'financing', 'storage'],
    default: 'purchase'
  },
  contractFileUrl: { type: String }, // URL to stored PDF file
  status: {
    type: String,
    enum: ['draft', 'signed', 'executed', 'archived'],
    default: 'draft'
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Contract', ContractSchema);
