// Date: 062625 [1000], © 2025 CFH
import { logger } from '@utils/logger';
export function getBidIncrement(type: string): number {
  logger.info(`Fetching bid increment for ${type}`);
  return type === 'premium' ? 500 : 100;
}
export function getAuctionDuration(type: string): number {
  logger.info(`Fetching duration for ${type}`);
  return type === 'premium' ? 7200 : 3600;
}
