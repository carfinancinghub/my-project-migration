/**
 * @file InsurancePolicy.js
 * @path backend/models/insurance/InsurancePolicy.js
 * @description Mongoose schema for insurance policies, supporting risk scoring, audit logs, and checklist validation. Crown Certified for CFH Insurance test prep.
 * @author Cod2
 */

import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * @field auditLog - Array of audit actions taken on the policy.
 * @field action - Action name performed on the policy
 * @field user - Email of the user who performed the action
 * @field timestamp - When the action occurred
 */
const AuditLogSchema = new Schema({
  action: { type: String, required: true, trim: true },
  user: { type: String, required: true, trim: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

/**
 * @field checklist - Array of underwriting checklist items.
 * @field description - Description of the checklist item
 * @field completed - Boolean indicating if the item is completed
 */
const ChecklistItemSchema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    minlength: 3,
    match: /^[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/
  },
  completed: { type: Boolean, required: true }
}, { _id: false });

const InsurancePolicySchema = new Schema({
  /** @field policyId - Unique policy identifier */
  policyId: { type: String, required: true, unique: true, index: true },

  /** @field vehicleId - Associated vehicle VIN or ID */
  vehicleId: { type: String, required: true, index: true },

  /** @field quoteAmount - Insurance quote amount */
  quoteAmount: { type: Number, required: true },

  /** @field status - Policy status (draft, pending, approved) */
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved'],
    default: 'draft'
  },

  /** @field conditions - Special policy conditions or clauses */
  conditions: {
    type: [
      {
        type: String,
        trim: true,
        minlength: 3,
        match: /^[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/
      }
    ],
    default: []
  },

  /** @field riskScore - AI-calculated risk score */
  riskScore: { type: Number, default: null },

  /** @field premium - Premium tier flag */
  premium: { type: Boolean, default: false },

  /** @field auditLog - Actions logged for policy changes */
  auditLog: { type: [AuditLogSchema], default: [] },

  /** @field checklist - Underwriting checklist for policy validation */
  checklist: { type: [ChecklistItemSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('InsurancePolicy', InsurancePolicySchema);
