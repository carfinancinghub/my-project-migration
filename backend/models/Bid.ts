/**
 * © 2025 CFH, All Rights Reserved
 * File: Bid.ts
 * Path: backend/models/Bid.ts
 * Purpose: Mongoose schema for Bid model
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [0803]
 * Version: 1.0.1
 * Version ID: i9j0k1l2-m3n4-5678-9012-345678901234
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: i9j0k1l2-m3n4-5678-9012-345678901234
 * Save Location: backend/models/Bid.ts
 *
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with Mongoose Schema typing
 * - Added indexes for lender and auction fields
 * - Added validation hooks for amount (positive number)
 * - Timestamps option is already enabled
 * - Exported as default for consistency
 * - Improved: Added pre-save hook for amount validation
 */

import { Schema, model, Document, HookNextFunction } from 'mongoose';

interface IBid extends Document {
  lender: Schema.Types.ObjectId;
  auction: Schema.Types.ObjectId;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

const BidSchema = new Schema<IBid>(
  {
    lender: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    auction: { type: Schema.Types.ObjectId, ref: 'Auction', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Pre-save hook for additional validation
BidSchema.pre('save', function (next: HookNextFunction) {
  if (this.amount <= 0) {
    return next(new Error('Amount must be positive'));
  }
  next();
});

export default model<IBid>('Bid', BidSchema);
