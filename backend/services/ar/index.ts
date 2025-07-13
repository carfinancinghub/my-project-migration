// Date: 062625 [1000], © 2025 CFH
import { logger } from '@utils/logger';
export function getARModel(vehicleId: string) {
  logger.info(`Fetching AR model for vehicle ${vehicleId} (stub)`);
  return { model: 'ar_model' };
}
