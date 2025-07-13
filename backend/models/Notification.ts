import mongoose from 'mongoose';

export interface Notification extends mongoose.Document {
  userId: string;
  message: string;
  type: string;
  createdAt: Date;
  read: boolean;
  digestSent: boolean;
}

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  digestSent: { type: Boolean, default: false }
});

export const Notification = mongoose.model<Notification>('Notification', notificationSchema);
