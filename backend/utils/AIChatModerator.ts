import logger from '@config/logger';

export class AIChatModerator {
  static async moderateMessage(messageContent: string): Promise<boolean> {
    try {
      return true; // Mock moderation
    } catch (err) {
      logger.error(`Moderation error: ${(err as Error).message}`);
      return false;
    }
  }
}
