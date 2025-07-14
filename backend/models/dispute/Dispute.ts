/**
 * © 2025 CFH, All Rights Reserved
 * File: Dispute.ts
 * Path: C:\CFH\backend\models\dispute\Dispute.ts
 * Purpose: Mongoose model for managing user disputes including arbitration workflow, AI summaries, and tier-aware enhancements in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-14 [1307]
 * Version: 1.1.0
 * Version ID: 5f2a3c1d-e4b6-7f8a-9d0c-1b2e3f4a5c6d
 * Crown Certified: Yes (pending final test)
 * Batch ID: Compliance-071425
 * Artifact ID: 5f2a3c1d-e4b6-7f8a-9d0c-1b2e3f4a5c6d
 * Save Location: C:\CFH\backend\models\dispute\Dispute.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-14 [1307]
 */

import mongoose, { Document, Schema } from 'mongoose';
import logger from '@utils/logger'; // Alias import

export interface DisputeDocument extends Document {
  userId: string;
  reason: string;
  status: 'open' | 'pending' | 'resolved';
  tier?: 'Free' | 'Standard' | 'Premium' | 'Wow++';
  evidenceUrls?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  aiSummary?: string; // Premium: AI-generated summary
  resolutionVotes?: { arbitratorId: string; vote: 'buyer' | 'seller'; timestamp: Date }[]; // Wow++: Vote tracking
}

const DisputeSchema = new Schema<DisputeDocument>(
  {
    userId: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['open', 'pending', 'resolved'], default: 'open' },
    tier: { type: String, enum: ['Free', 'Standard', 'Premium', 'Wow++'], default: 'Free' },
    evidenceUrls: [{ type: String }],
    aiSummary: { type: String, required: false }, // Premium
    resolutionVotes: [
      {
        arbitratorId: { type: String },
        vote: { type: String, enum: ['buyer', 'seller'] },
        timestamp: { type: Date },
      },
    ], // Wow++
  },
  {
    timestamps: true,
  }
);

// Audit logging for dispute updates
DisputeSchema.pre('save', function (next) {
  logger.info(`Dispute ${this._id} saved with status: ${this.status}`, {
    meta: { correlationId: this._id.toString() },
  });
  next();
});

export default mongoose.model<DisputeDocument>('Dispute', DisputeSchema);
