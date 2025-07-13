import cron from 'node-cron';

export class AuctionAnalyticsScheduler {
  static scheduleAnalytics(): void {
    cron.schedule('0 0 * * *', () => {
      console.log('Running analytics...');
    });
  }
}
