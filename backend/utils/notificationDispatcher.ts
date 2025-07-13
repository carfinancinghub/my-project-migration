import { Notification } from '@models/Notification';

interface NotificationData {
  userId: string;
  type: string;
  message: string;
}

export class NotificationDispatcher {
  static async dispatch(data: NotificationData): Promise<void> {
    const notification = new Notification({ ...data, relatedId: null });
    await notification.save();
  }
}
