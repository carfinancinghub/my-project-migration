/**
 * © 2025 CFH, All Rights Reserved
 * File: Notification.ts
 * Path: C:\cfh\backend\models\Notification.ts
 * Purpose: Mongoose schema for Notification model in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [1702]
 * Version: 1.0.1
 * Version ID: e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0
 * Save Location: backend/models/Notification.ts
 * Updated By: Cod1
 * Timestamp: 2025-07-18 [1702]
 */

/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Interface for schema, message sanitization, static expiry, soft delete suggestion.
 * - ARIA: Accessible notifications for premium/engagement features.
 */

import { Schema, model, Document, Query } from 'mongoose';
import sanitizeHtml from 'sanitize-html'; // Assume installed

export interface INotification extends Document {
  userId: Schema.Types.ObjectId;
  type: string;
  title: string;
  message?: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
  markAsRead: () => void;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: [
        'System', 'Message', 'DisputeUpdate', 'LoanUpdate', 'InspectionUpdate',
        'DeliveryUpdate', 'AuctionActivity', 'PaymentStatus', 'BadgeEarned'
      ],
      required: true
    },
    title: { type: String, required: true, maxlength: 200 },
    message: { type: String, maxlength: 2000 },
    link: { type: String },
    isRead: { type: Boolean, default: false, index: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

// Index for query speed
notificationSchema.index({ userId: 1, isRead: 1 });

// Method to mark as read
notificationSchema.methods.markAsRead = function (): void {
  this.isRead = true;
};

// Static: Expire old notifications
notificationSchema.statics.expireOld = function (): Query<any, INotification> {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

// Pre-save: Sanitize message
notificationSchema.pre('save', function (next) {
  if (this.message) {
    this.message = sanitizeHtml(this.message, { allowedTags: [] }); // Plain text
  }
  next();
});

export default model<INotification>('Notification', notificationSchema);
