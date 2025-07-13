import { Dispute } from '@models/dispute/Dispute';
import logger from '@config/logger';
import { AnalyticsExportUtils } from '@utils/analyticsExportUtils';
import { AIResolutionRecommender } from '@utils/AIResolutionRecommender';

export class DisputeResolutionHelper {
  static async resolve(status: string): Promise<any> {
    const disputes = await Dispute.find();
    return disputes.reduce((acc: any[], d: any) => acc.concat(d), []);
  }
}
