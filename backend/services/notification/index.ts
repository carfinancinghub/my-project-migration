// Date: 062625 [1000], © 2025 CFH
import { logger } from '@utils/logger';
export function sendNotification(to: string, message: string) {
  logger.info(`Sending notification to ${to}: ${message} (stub)`);
  return { status: 'sent' };
}
