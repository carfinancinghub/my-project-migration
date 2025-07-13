import admin from 'firebase-admin';

export class PushNotificationService {
  static async sendPushNotification(userId: string, message: string): Promise<void> {
    await admin.messaging().send({
      token: userId,
      notification: { title: 'CFH Notification', body: message }
    });
  }
}
