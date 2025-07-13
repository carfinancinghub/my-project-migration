import { Lender } from '@models/lender/Lender';
import logger from '@config/logger';

interface BorrowerData {
  id: string;
  profile: Record<string, any>;
}

export class LenderMatchEngine {
  static async match(borrowerData: BorrowerData, lenderData: any): Promise<any> {
    const lenders = await Lender.find();
    return lenders;
  }
}
