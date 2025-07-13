# 📘 Test Suite: escrowNotifyRoutes.test.js

## Purpose
Validate escrow notification endpoints (`POST /api/escrow/notify/deposit`, `POST /api/escrow/notify/release`) for functionality, premium gating, and error handling.

## Test Scenarios

### POST /api/escrow/notify/deposit
- ✅ Free: Validates DB log via `syncEscrowAction`
- ✅ Premium: Validates `syncToBlockchain` + `getBlockchainAuditTrail` + `WebSocketService.push`
- ❌ Premium Gating: Fallbacks to free when `isPremium=false`
- ❌ Error Handling: 400 for missing data, 500 for sync failure

### POST /api/escrow/notify/release
- ✅ Free: DB log and response
- ✅ Premium: Blockchain + WebSocket push
- ❌ Premium Gating: Ensures premium logic is skipped
- ❌ Error Handling: Invalid and failed sync scenarios

### Other
- ⚠️ Simulated test placeholder for rate limiting
- 📌 All failures assert `logger.error` calls

## Dependencies
- `jest`, `supertest`
- `@services/escrow/EscrowChainSync` (mocked)
- `@services/notification/WebSocketService` (mocked)
- `@utils/logger` (mocked)
