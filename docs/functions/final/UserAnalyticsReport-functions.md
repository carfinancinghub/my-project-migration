## UserAnalyticsReport.js Functions Summary
- **generateActivityReport**: Generates a user activity report for a date range.
  - **Inputs**: `startDate: string`, `endDate: string`.
  - **Outputs**: Object with total users, actions, and breakdown by type.
  - **Dependencies**: `services/db`.
- **generateEngagementReport**: Generates an engagement report for auctions in a date range.
  - **Inputs**: `startDate: string`, `endDate: string`.
  - **Outputs**: Object with auction stats, bids, and active users.
  - **Dependencies**: `services/db`.