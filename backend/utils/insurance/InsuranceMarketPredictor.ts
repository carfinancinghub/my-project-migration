import { InsurancePolicy } from '@models/insurance/InsurancePolicy';

export class InsuranceMarketPredictor {
  static async predictMarket(region: string, timeframe: string): Promise<any> {
    const policy = await InsurancePolicy.findOne({ region });
    if (!policy) {
      throw new Error('Policy not found');
    }
    return { prediction: 'mock' };
  }
}
