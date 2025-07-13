import logger from '@config/logger';

interface Reputation {
  id: string;
  score: number;
}

export class SellerBadgeEngine {
  static async assignBadge(reputation: Reputation): Promise<string> {
    return reputation.score > 80 ? 'Gold' : 'Silver';
  }
}
