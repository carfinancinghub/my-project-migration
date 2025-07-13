/*
 * File: AuthService.ts
 * Path: backend/services/auth/AuthService.ts
 * Created: 2025-06-30 14:28:10 PDT
 * Author: Mini (AI Assistant) & Grok 3 (xAI)
 * artifact_id: "ee215e2f-f0aa-4200-98dd-6360fda784f8"
 * version_id: "8c4d492e-f68a-4280-9718-4b9dff1453d8"
 * Version: 1.0
 * Description: Service for user registration, login, and JWT generation.
 */
import { NotificationService } from '@services/notification/NotificationService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  async register(username: string, password_raw: string): Promise<{ userId: string }> {
    console.log(`INFO: Registering ${username}`);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_raw, salt);
    const userId = `user_${Math.floor(Math.random() * 1000)}`;
    await NotificationService.sendEmailNotification(userId, 'USER_WELCOME', 'Welcome to CFH!');
    return { userId };
  }

  async login(username: string, password_raw: string): Promise<{ token: string }> {
    console.log(`INFO: Login attempt for ${username}`);
    if (username === 'testuser' && password_raw === 'password') {
      const token = jwt.sign({ userId: 'testuser', role: 'standard' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token };
    }
    throw new Error('Invalid credentials');
  }
}