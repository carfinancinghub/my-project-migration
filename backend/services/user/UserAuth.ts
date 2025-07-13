import mongoose from 'mongoose';
import { User } from '@models/User';

export class UserAuth {
  static async authenticate(email: string, password: string): Promise<any> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    return { token: 'mock' }; // Mock authentication
  }
}
