## UserNotifications.js Functions Summary
- **updateNotificationPreferences**: Updates user notification preferences.
  - **Inputs**: `userId: string`, `preferences: object`.
  - **Outputs**: Object with update status and new preferences.
  - **Dependencies**: `services/db`.
- **sendUserNotification**: Sends a notification to a user based on preferences.
  - **Inputs**: `userId: string`, `message: string`, `type: string`.
  - **Outputs**: Object with notification status.
  - **Dependencies**: `services/db`, `services/notifications`.