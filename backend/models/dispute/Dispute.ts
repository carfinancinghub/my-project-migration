/**
 * © 2025 CFH, All Rights Reserved
 * File: Dispute.ts
 * Path: backend/models/dispute/Dispute.ts
 * Purpose: Robust Mongoose model for managing user disputes, arbitration workflow, AI summaries, and tier-based features in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team (merged by Cod1, reviewed by Grok)
 * Date: 2025-07-18 [1359]
 * Version: 1.2.0
 * Version ID: cod1-merge-1359-bucket-v1
 * Crown Certified: Yes (pending final test)
 * Batch ID: Compliance-071825
 * Artifact ID: cod1-merge-1359-bucket-v1
 * Save Location: backend/models/dispute/Dispute.ts
 * Updated By: Cod1 + Grok
 */
/**
 * Side Note: Cod1+ Merge & Enhancements
 * - Combines tier-aware fields (Free, Standard, Premium, Wow++), AI summary, and resolutionVotes (from [1307])
 * - Includes multi-party support, arbitration judgePool, votes array, methods, and statusHistory audit (from [1351])
 * - Virtuals: duration in hours, statusHistory for analytics/compliance
 * - Pre-save: audit logging + status/votes/resolved validation
 * - Suggest: Add static role/permission methods, more Jest tests (edge, multi-tier, AI)
 * - Ready for production, tiered upscaling, and future AI upgrades.
 */

import { Schema, model, Document, HookNextFunction } from 'mongoose';
import logger from '@utils/logger';

interface IVote {
  judgeId: Schema.Types.ObjectId;
  vote: 'Yes' | 'No' | 'Neutral' | 'buyer' | 'seller';
  comment?: string;
  timestamp: Date;
}

interface StatusHistoryEntry {
  status: 'Open' | 'Voting' | 'Resolved' | 'Escalated' | 'pending';
  timestamp: Date;
  changedBy?: Schema.Types.ObjectId;
}

export interface IDispute extends Document {
  transactionId?: Schema.Types.ObjectId;
  transactionModel?: 'Auction' | 'Delivery' | 'LoanOffer' | 'Payment';
  raisedBy?: Schema.Types.ObjectId;
  againstUser?: Schema.Types.ObjectId;
  userId?: string; // Simple disputes
  reason?: string;
  description?: string;
  status: 'Open' | 'Voting' | 'Resolved' | 'Escalated' | 'open' | 'pending' | 'resolved';
  judgePool?: Schema.Types.ObjectId[];
  votes: IVote[];
  resolution?: string;
  resolvedAt?: Date;
  tier?: 'Free' | 'Standard' | 'Premium' | 'Wow++';
  evidenceUrls?: string[];
  aiSummary?: string; // Premium/above
  resolutionVotes?: { arbitratorId: string; vote: 'buyer' | 'seller'; timestamp: Date }[]; // Wow++
  statusHistory?: StatusHistoryEntry[];
  getVoteSummary: () => { yes: number; no: number; neutral: number; buyer: number; seller: number };
  addJudge: (judgeId: Schema.Types.ObjectId) => void;
  removeJudge: (judgeId: Schema.Types.ObjectId) => void;
  assignJudges: (judgeIds: Schema.Types.ObjectId[]) => void;
  duration?: number;
}

const voteSchema = new Schema<IVote>({
  judgeId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  vote: { type: String, enum: ['Yes', 'No', 'Neutral', 'buyer', 'seller'], required: true },
  comment: { type: String, maxlength: 1000 },
  timestamp: { type: Date, default: Date.now }
});

const statusHistorySchema = new Schema<StatusHistoryEntry>({
  status: { type: String, enum: ['Open', 'Voting', 'Resolved', 'Escalated', 'pending'], required: true },
  timestamp: { type: Date, default: Date.now },
  changedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const disputeSchema = new Schema<IDispute>(
  {
    // Multi-party, arbitration-based
    transactionId: { type: Schema.Types.ObjectId, refPath: 'transactionModel', index: true },
    transactionModel: { type: String, enum: ['Auction', 'Delivery', 'LoanOffer', 'Payment'] },
    raisedBy: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    againstUser: { type: Schema.Types.ObjectId, ref: 'User' },
    judgePool: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    votes: [voteSchema],

    // Simpler/legacy
    userId: { type: String },
    reason: { type: String },
    description: { type: String, maxlength: 3000 },
    status: { type: String, enum: ['Open', 'Voting', 'Resolved', 'Escalated', 'open', 'pending', 'resolved'], default: 'Open' },
    resolution: { type: String, maxlength: 3000 },
    resolvedAt: Date,
    evidenceUrls: [{ type: String }],
    aiSummary: { type: String },
    resolutionVotes: [
      {
        arbitratorId: { type: String },
        vote: { type: String, enum: ['buyer', 'seller'] },
        timestamp: { type: Date }
      }
    ],
    tier: { type: String, enum: ['Free', 'Standard', 'Premium', 'Wow++'], default: 'Free' },
    statusHistory: [statusHistorySchema]
  },
  { timestamps: true }
);

// Method for vote summary
disputeSchema.methods.getVoteSummary = function (): { yes: number; no: number; neutral: number; buyer: number; seller: number } {
  return this.votes.reduce(
    (acc: { yes: number; no: number; neutral: number; buyer: number; seller: number }, vote: IVote) => {
      acc[vote.vote.toLowerCase() as keyof typeof acc]++;
      return acc;
    },
    { yes: 0, no: 0, neutral: 0, buyer: 0, seller: 0 }
  );
};

// Judge pool management methods
disputeSchema.methods.addJudge = function (judgeId: Schema.Types.ObjectId): void {
  if (!this.judgePool.includes(judgeId)) this.judgePool.push(judgeId);
};

disputeSchema.methods.removeJudge = function (judgeId: Schema.Types.ObjectId): void {
  this.judgePool = this.judgePool.filter((id: Schema.Types.ObjectId) => !id.equals(judgeId));
};

disputeSchema.methods.assignJudges = function (judgeIds: Schema.Types.ObjectId[]): void {
  this.judgePool = [...new Set([...(this.judgePool || []), ...judgeIds])];
};

// Virtual for duration (hours)
disputeSchema.virtual('duration').get(function (): number | undefined {
  if (this.resolvedAt && this.createdAt) {
    return (this.resolvedAt.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60); // hours
  }
});

// Pre-save hook for audit logging and status logic
disputeSchema.pre('save', function (next: HookNextFunction) {
  logger.info(`Dispute ${this._id} saved with status: ${this.status}`, {
    meta: { correlationId: this._id.toString() },
  });
  if ((this.status === 'Resolved' || this.status === 'resolved') && (!this.votes || this.votes.length === 0)) {
    return next(new Error('Resolved disputes must have votes'));
  }
  if ((this.status === 'Resolved' || this.status === 'resolved') && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  if (!this.statusHistory) this.statusHistory = [];
  if (
    this.isModified('status') &&
    (!this.statusHistory.length || this.statusHistory[this.statusHistory.length - 1].status !== this.status)
  ) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      // Optionally: changedBy set by service/controller
    });
  }
  next();
});

export { IDispute };
export default model<IDispute>('Dispute', disputeSchema);
