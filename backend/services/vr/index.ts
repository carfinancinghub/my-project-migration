// Date: 062625 [1000], © 2025 CFH
import { logger } from '@utils/logger';
export function createVRTour(userId: string, vehicleId: string) {
  logger.info(`Creating VR tour for vehicle ${vehicleId} by user ${userId} (stub)`);
  return { status: 'created' };
}
