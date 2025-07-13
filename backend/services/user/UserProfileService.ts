import mongoose from 'mongoose';
import { User } from '@models/User';

export class UserProfileService {
  static async getProfile(userId: string): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  static async updateProfile(userId: string, data: any): Promise<any> {
    const user = await User.findByIdAndUpdate(userId, data, { new: true });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
