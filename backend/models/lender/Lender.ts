/**
 * © 2025 CFH, All Rights Reserved
 * File: Lender.ts
 * Path: C:\cfh\backend\models\lender\Lender.ts
 * Purpose: Mongoose schema for Lender entity in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [1701]
 * Version: 1.0.1
 * Version ID: b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7
 * Save Location: backend/models/lender/Lender.ts
 * Updated By: Cod1
 * Timestamp: 2025-07-18 [1701]
 */

/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Interface for schema, stricter licenseNumber validation, static finders.
 * - Methods for adding/removing/bulk-removing loans.
 * - Pre-save hook for unique specializations.
 * - Premium suggestion: expose advanced analytics and filtering.
 */

import { Schema, model, Document, Query } from 'mongoose';

export interface ILender extends Document {
  user: Schema.Types.ObjectId;
  companyName: string;
  licenseNumber?: string;
  fundingLimit: number;
  approved: boolean;
  specializations: string[];
  activeLoans: Schema.Types.ObjectId[];
  addLoan: (loanId: Schema.Types.ObjectId) => void;
  removeLoan: (loanId: Schema.Types.ObjectId) => void;
  removeAllLoans: () => void;
}

const LenderSchema = new Schema<ILender>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyName: { type: String, required: true },
    licenseNumber: { type: String, match: /^[A-Z0-9-]{5,20}$/ },
    fundingLimit: { type: Number, default: 0 },
    approved: { type: Boolean, default: false, index: true },
    specializations: {
      type: [String],
      enum: ['fico', 'equity', 'ira', 'fleet', 'refinance'],
      default: ['fico'],
    },
    activeLoans: [{ type: Schema.Types.ObjectId, ref: 'Loan' }],
  },
  { timestamps: true }
);

// Loan management methods
LenderSchema.methods.addLoan = function (loanId: Schema.Types.ObjectId): void {
  if (!this.activeLoans.includes(loanId)) this.activeLoans.push(loanId);
};

LenderSchema.methods.removeLoan = function (loanId: Schema.Types.ObjectId): void {
  this.activeLoans = this.activeLoans.filter((id: Schema.Types.ObjectId) => !id.equals(loanId));
};

LenderSchema.methods.removeAllLoans = function (): void {
  this.activeLoans = [];
};

// Static: Search by specialization
LenderSchema.statics.findBySpecialization = function (spec: string): Query<ILender[], ILender> {
  return this.find({ specializations: spec });
};

// Pre-save: Uniqueness in specializations
LenderSchema.pre('save', function (next) {
  this.specializations = [...new Set(this.specializations)];
  next();
});

export default model<ILender>('Lender', LenderSchema);
