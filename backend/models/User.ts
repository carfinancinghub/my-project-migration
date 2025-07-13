import mongoose from 'mongoose';

export interface User extends mongoose.Document {
  id: string;
  userId: string;
  name: string;
  email: string;
  roles: string[];
  emailNotifications?: Record<string, boolean>;
  pushNotifications?: Record<string, boolean>;
  inAppNotifications?: Record<string, boolean>;
}

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  roles: { type: [String], required: true },
  emailNotifications: { type: Map, of: Boolean },
  pushNotifications: { type: Map, of: Boolean },
  inAppNotifications: { type: Map, of: Boolean }
});

export const User = mongoose.model<User>('User', userSchema);
