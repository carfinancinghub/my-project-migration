## AuctionScheduler.js Functions Summary
- **scheduleAuctions**: Schedules auction start and end times with cron jobs.
  - **Inputs**: None.
  - **Outputs**: None (runs continuously).
  - **Dependencies**: `services/db`, `services/auction/AuctionManager`, `node-cron`.
- **scheduleAuction**: Schedules a specific auction with start and end times.
  - **Inputs**: `auctionId: string`, `startTime: string`, `endTime: string`.
  - **Outputs**: Object with scheduling status.
  - **Dependencies**: `services/db`.