import mongoose from 'mongoose';
import { User } from '@models/User';

export class TrustScoreEngine {
  static async calculateScore(userId: string): Promise<number> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return 80; // Mock score
  }
}
