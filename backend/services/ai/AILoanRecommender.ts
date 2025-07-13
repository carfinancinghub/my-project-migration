import mongoose from 'mongoose';
import { User } from '@models/User';

export class AILoanRecommender {
  static async recommendLoan(userId: string): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { loan: 'mock' }; // Mock recommendation
  }
}
