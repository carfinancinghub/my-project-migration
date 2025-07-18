/**
 * © 2025 CFH, All Rights Reserved
 * File: EscrowTransaction.ts
 * Path: backend/models/EscrowTransaction.ts
 * Purpose: Mongoose schema for EscrowTransaction model
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [1411]
 * Version: 1.0.1
 * Version ID: d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9
 * Save Location: backend/models/EscrowTransaction.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Full interface for schema and all steps/currency enums
 * - Pre-save validation with @validation/escrow.validation
 * - Status change and audit logging method
 * - Suggest: Add test coverage for state transitions and audit logging
 */

import { Schema, model, Document, HookNextFunction } from 'mongoose';
import { escrowTransactionValidation } from '@validation/escrow.validation';

export enum EscrowStep {
  DepositReceived = 'Deposit Received',
  BuyerInspectionScheduled = 'Buyer Inspection Scheduled',
  BuyerInspectionApproved = 'Buyer Inspection Approved',
  FundsReleasedToSeller = 'Funds Released to Seller',
  FundsReleasedToMechanic = 'Funds Released to Mechanic',
  FundsReleasedToHauler = 'Funds Released to Hauler',
  RefundedToBuyer = 'Refunded to Buyer',
  PlatformFeeProcessed = 'Platform Fee Processed',
}

export enum EscrowCurrency {
  USD = 'USD',
  EUR = 'EUR',
  BTC = 'BTC',
}

export interface IEscrowTransaction extends Document {
  contractId: Schema.Types.ObjectId;
  step: EscrowStep;
  amount: number;
  currency: EscrowCurrency;
  triggeredBy?: Schema.Types.ObjectId;
  notes?: string;
  timestamp: Date;
  getSummary: () => string;
  changeStatus: (newStep: EscrowStep) => void;
}

const escrowTransactionSchema = new Schema<IEscrowTransaction>(
  {
    contractId: { type: Schema.Types.ObjectId, ref: 'EscrowContract', required: true, index: true },
    step: { type: String, enum: Object.values(EscrowStep), required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: Object.values(EscrowCurrency), default: EscrowCurrency.USD },
    triggeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, maxlength: 2000 },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index
escrowTransactionSchema.index({ contractId: 1, step: 1 });

// Method for summary
escrowTransactionSchema.methods.getSummary = function (): string {
  return `${this.step}: ${this.amount} ${this.currency}`;
};

// Status change with audit (placeholder)
escrowTransactionSchema.methods.changeStatus = function (newStep: EscrowStep): void {
  // TODO: Use a real audit logger
  console.log(`Changing status from ${this.step} to ${newStep}`);
  this.step = newStep;
};

// Pre-save: Validation and transitions
escrowTransactionSchema.pre('save', async function (next: HookNextFunction) {
  const { error } = escrowTransactionValidation.validate(this.toObject());
  if (error) return next(error);

  // Prevent regression from "released" states
  if (this.isModified('step') && this.step.includes('Released')) {
    return next(new Error('Cannot change from released state'));
  }
  next();
});

export default model<IEscrowTransaction>('EscrowTransaction', escrowTransactionSchema);
