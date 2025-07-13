import { Lender } from '@models/lender/Lender';
import logger from '@config/logger';

interface BorrowerData {
  id: string;
  profile: Record<string, any>;
}

export class AILenderMatchRecommender {
  static async generateRecommendations(borrowerData: BorrowerData): Promise<any[]> {
    const lenders = await Lender.find();
    return lenders.map(l => ({ lenderId: l.id }));
  }
}
