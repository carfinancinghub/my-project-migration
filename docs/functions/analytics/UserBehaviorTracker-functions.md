## UserBehaviorTracker.js Functions Summary
- **trackAction**: Tracks a user action for analytics.
  - **Inputs**: `userId: string`, `action: string`, `details: object`.
  - **Outputs**: Object with tracking status.
  - **Dependencies**: `services/db`.
- **getUserBehavior**: Retrieves user behavior data within a date range.
  - **Inputs**: `userId: string`, `startDate: string`, `endDate: string`.
  - **Outputs**: Array of user behavior records.
  - **Dependencies**: `services/db`.