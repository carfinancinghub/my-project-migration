// Date: 062625 [1000], © 2025 CFH
import { logger } from '@utils/logger';
import { Dispute } from '@models/dispute/Dispute';
export function linkDispute(transactionId: string, disputeId: string) {
  logger.info(`Linking dispute ${disputeId} to transaction ${transactionId} (stub)`);
  return { status: 'linked' };
}
