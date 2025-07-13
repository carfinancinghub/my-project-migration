import { NotificationService } from '@services/notification/NotificationService';

export class AuctionNotifier {
  static async notify(auctionId: string, message: string): Promise<void> {
    await NotificationService.sendEmailNotification('user1', 'AUCTION_OUTBID', message);
  }
}
