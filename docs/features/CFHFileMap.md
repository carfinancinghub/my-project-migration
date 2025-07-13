# CFH File Map
## Date: 062625 [1000], © 2025 CFH

## Project Structure Summary
- `services/` — Implemented (Payments, Reports, Escrow, UserProfileService, NotificationService, Auction, AI, UserAuth, AuctionNotifier, BlockchainEscrowAudit, AILoanRecommender, UserActivity)
- `routes/` — Implemented (Payments, Reports, User, Marketplace, Auctions, Escrow, AI, Analytics, Inspection, Insurance, Judge, Lender, Mechanic, Messages, Onboarding, Reputation, Reviews, Seller, Storage, Users)
- `controllers/` — Implemented (AuctionReputationTracker, NotificationController, UserController)
- `tests/` — Implemented (Payments, Reports, Notifications, Auctions, Analytics, Escrow, User, Middleware, Storage, Routes, Integration)
- `workers/` — Implemented (notificationQueueWorker)
- `docs/` — Implemented (features/Analytics.md, features/CFHFileMap.md, fix_summary.md, mini_evaluation_20250627_173945.md)
- `utils/` — Implemented (pdfGenerator, notificationDispatcher, cron, axios, i18n, errors, logger, notificationQueue, emailProvider)
- `types/` — Implemented (utils.d.ts)
- `tests/` — Implemented (helpers.ts)
- `cypress/` — Implemented (e2e/CollaborationChat.cy.ts, e2e/CollaborationChat05040109.cy.ts, support/e2e.ts, support/commands.ts)
- `root/` — Implemented (index.ts, package.json, tsconfig.json)

## Missing Files
- None

## Stubbed or Planned
- `webSocketService`, `notificationQueue`, `auditLogger` (mocked, pending real implementations)

## Known Issues and Fixes Applied
- `tests/setup.ts`: Fixed typos (`jast.fn()`, `jot.fn()` to `jest.fn()`).
- `EscrowService.ts`: Fixed `TS2322`, added UUID, audit logging, analytics, `initiateDispute`, fixed TS1005 syntax errors (`Revised_53.md`).
- `EscrowRoutes.test.ts`: Added tests for malformed data, state transitions, fixed TS1005 syntax error (`Revised_53.md`).
- `NotificationService.ts`: Fixed camelCase, added WebSocket, preferences, Redis, Handlebars, DLQ worker.
- `NotificationService.test.ts`: Added tests for Redis failure, provider errors, DLQ worker.
- `UserProfileService.getProfile()`: Fixed static method usage, added JSDoc.
- `BidHeatmapService.ts`: Fixed parsing errors, `no-console`, `TS7006`, converted to ESM.
- `cypress/e2e/CollaborationChat.cy.js`: Fixed `no-undef` for `cy`, renamed to `.cy.ts`.
- `notificationService.ts`: Removed, replaced with `NotificationService.ts`.
- `Cypress server issue`: Fixed missing `build` script in `package.json`, added `index.ts` (`Revised_52.md`), added `tsconfig.json` (`Revised_55.md`), fixed missing dependencies and PM2 (`Revised_56.md`).

## Total ESLint Issues
- Resolved: All issues (per `eslint_20250627_192102.log`)

## Deployment Status
- Successful deployment on 2025-06-27 (per `deploy_20250627_183807.log`)
- Server startup issue for Cypress fixed in `Revised_56.md`

## Logs
- Synced to Google Drive in `C:\CFH\Cod1Logs`
