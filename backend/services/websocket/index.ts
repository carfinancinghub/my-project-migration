// Date: 062625 [1000], © 2025 CFH
import { logger } from '@utils/logger';
export function joinRoom(userId: string, auctionId: string) {
  logger.info(`User ${userId} joining websocket room for auction ${auctionId} (stub)`);
  return { status: 'joined' };
}
