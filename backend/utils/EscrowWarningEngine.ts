import { Notification } from '@models/Notification';
import logger from '@config/logger';
import { Escrow } from '@models/Escrow';

export class EscrowWarningEngine {
  static async warnUser(userId: string, message: string): Promise<void> {
    const notification = new Notification({ userId, message, type: 'WARNING', createdAt: new Date(), read: false, digestSent: false });
    await notification.save();
  }

  static async checkEscrow(escrow: string): Promise<any> {
    const e = await Escrow.findById(escrow);
    if (!e) {
      throw new Error('Escrow not found');
    }
    return { warning: 'mock' };
  }
}
