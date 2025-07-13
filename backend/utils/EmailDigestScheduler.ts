import cron from 'node-cron';

export class EmailDigestScheduler {
  static scheduleDigest(): void {
    cron.schedule('0 8 * * *', () => {
      console.log('Sending email digest...');
    });
  }
}
