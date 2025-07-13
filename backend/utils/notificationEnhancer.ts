interface Notification {
  type: string;
  data: Record<string, any>;
}

export class NotificationEnhancer {
  static async enhance(notification: Notification): Promise<any> {
    const styles: Record<string, string> = {
      system: 'color: blue',
      message: 'color: green',
      alert: 'color: red',
    };
    return { style: styles[notification.type] || 'color: black' };
  }
}
