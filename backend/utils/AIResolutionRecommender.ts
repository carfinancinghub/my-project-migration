import { Dispute } from '@models/dispute/Dispute';
import logger from '@config/logger';

export class AIResolutionRecommender {
  static async recommendResolution(dispute: string): Promise<string> {
    const d = await Dispute.findById(dispute);
    if (!d) {
      throw new Error('Dispute not found');
    }
    return 'mock resolution';
  }
}
