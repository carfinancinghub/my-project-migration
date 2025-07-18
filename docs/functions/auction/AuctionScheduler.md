<!--
File: AuctionScheduler.md
Path: C:\CFH\docs\functions\auction\AuctionScheduler.md
Purpose: Documentation and usage reference for AuctionScheduler service (start/end scheduling for vehicle auctions)
Author: CFH Dev Team, Grok
Date: 2025-07-18 [1348]
Version: 1.0.1
Crown Certified: Yes
Batch ID: Compliance-071825
Artifact ID: l2m3n4o5-p6q7-8901-2345-678901234567
Save Location: C:\CFH\docs\functions\auction\AuctionScheduler.md
-->

# AuctionScheduler Service

## Overview
`AuctionScheduler.ts` automates the scheduling of vehicle auction start and end times using cron jobs. It ensures that auctions activate and close at the correct time, provides error handling and retry logic, and logs all scheduling actions for traceability. The service is fully typed and supports environment-based cron config.

---

## Features
- **Automated Scheduling**: Uses cron (`node-cron`) to start/end auctions at scheduled times.
- **Type Safety**: Fully TypeScript with auction and schedule typings.
- **Validation**: Date validation via `@validation/scheduler.validation` (Joi or similar).
- **Retry Logic**: Database operations retried up to 3 times.
- **Configurable Cron**: Pattern controlled via `process.env.CRON_SCHEDULE`.
- **Audit Logging**: All actions logged via `@utils/logger`.
- **Robust Error Handling**: Handles date errors, DB errors, and cron failures.

---

## Usage Example

```typescript
import AuctionScheduler from '@services/auction/AuctionScheduler';

// Start the global auction scheduler (usually in app bootstrap)
AuctionScheduler.scheduleAuctions();

// Schedule a specific auction to start/end
await AuctionScheduler.scheduleAuction('A123', '2025-09-01T10:00:00Z', '2025-09-03T20:00:00Z');
Integration Notes
Requires:

@utils/logger for logging,

@services/db for data access,

AuctionManager for start/end actions,

@validation/scheduler.validation for date validation.

Place .md file at:
C:\CFH\docs\functions\auction\AuctionScheduler.md

Test Coverage
See AuctionScheduler.test.ts in backend/tests/auction for comprehensive Jest unit tests (mocking cron, DB, and time logic).

Enhancement Suggestions
Integrate notifications for scheduled events (for seller/buyer).

Support for recurring or multi-stage auctions.

Expose metrics via health endpoint or dashboard.

Add integration tests with real cron jobs (not just mocks).
