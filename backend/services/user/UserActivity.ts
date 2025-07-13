import mongoose from 'mongoose';
import { User } from '@models/User';

export class UserActivity {
  static async logActivity(userId: string, action: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    // Log activity
  }
}
