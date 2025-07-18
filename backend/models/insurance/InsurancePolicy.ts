/**
 * © 2025 CFH, All Rights Reserved
 * File: InsurancePolicy.ts
 * Path: C:\cfh\backend\models\insurance\InsurancePolicy.ts
 * Purpose: Mongoose schema for insurance policies, supporting risk scoring, audit logs, and checklist validation
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [1702]
 * Version: 1.0.1
 * Version ID: c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8
 * Save Location: backend/models/insurance/InsurancePolicy.ts
 * Updated By: Cod1
 * Timestamp: 2025-07-18 [1702]
 */

/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Interfaces for audit log and checklist, compound indexes, risk scoring logic, audit search.
 * - Pre-save checklist validation, virtual duration, AI risk scoring suggestion.
 * - Premium: risk scoring with AI, audit trail search.
 */

import { Schema, model, Document, HookNextFunction, Query } from 'mongoose';

interface IAuditLog {
  action: string;
  user: string;
  timestamp: Date;
}

interface IChecklistItem {
  description: string;
  completed: boolean;
}

export interface IInsurancePolicy extends Document {
  policyId: string;
  vehicleId: string;
  quoteAmount: number;
  status: 'draft' | 'pending' | 'approved';
  conditions: string[];
  riskScore?: number;
  premium: boolean;
  auditLog: IAuditLog[];
  checklist: IChecklistItem[];
  logAudit: (action: string, user: string) => void;
  calculateRiskScore: () => number;
  duration?: number; // Virtual
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true, trim: true },
    user: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChecklistItemSchema = new Schema<IChecklistItem>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      minlength: 3,
      match: /^[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
    },
    completed: { type: Boolean, required: true },
  },
  { _id: false }
);

const InsurancePolicySchema = new Schema<IInsurancePolicy>(
  {
    policyId: { type: String, required: true, unique: true, index: true },
    vehicleId: { type: String, required: true, index: true },
    quoteAmount: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'pending', 'approved'], default: 'draft', index: true },
    conditions: { type: [String], default: [] },
    riskScore: { type: Number, default: null },
    premium: { type: Boolean, default: false },
    auditLog: { type: [AuditLogSchema], default: [] },
    checklist: { type: [ChecklistItemSchema], default: [] },
  },
  { timestamps: true }
);

// Compound indexes
InsurancePolicySchema.index({ policyId: 1, status: 1 });
InsurancePolicySchema.index({ vehicleId: 1, premium: 1 });

// Method for audit logging
InsurancePolicySchema.methods.logAudit = function (action: string, user: string): void {
  this.auditLog.push({ action, user });
};

// Auto-calculate riskScore (placeholder logic)
InsurancePolicySchema.methods.calculateRiskScore = function (): number {
  // Placeholder: Integrate AI service for Premium tier
  return Math.random() * 100;
};

// Virtual for duration (hours)
InsurancePolicySchema.virtual('duration').get(function (): number | undefined {
  if (this.createdAt && this.updatedAt) {
    return (this.updatedAt.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60);
  }
});

// Pre-save: Checklist validation for approved
InsurancePolicySchema.pre('save', function (next: HookNextFunction) {
  if (this.status === 'approved' && this.checklist.some((item: IChecklistItem) => !item.completed)) {
    next(new Error('All checklist items must be completed for approval'));
  }
  // Auto-calculate riskScore if not set
  if (this.riskScore === null) {
    this.riskScore = this.calculateRiskScore();
  }
  next();
});

// Static: Audit log search
InsurancePolicySchema.statics.searchAudit = function (action: string, user: string): Query<IInsurancePolicy[], IInsurancePolicy> {
  return this.find({ 'auditLog.action': action, 'auditLog.user': user });
};

export default model<IInsurancePolicy>('InsurancePolicy', InsurancePolicySchema);
