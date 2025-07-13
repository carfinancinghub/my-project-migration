# ✅ Test Coverage: escrowAuditLogRoutes.test.js

## Purpose
Validate escrow audit logging routes and blockchain sync logic (free + premium paths).

## Test Scenarios

### POST /api/escrow/audit/log
- ✅ Stores to database using `syncEscrowAction`
- ✅ Blockchain sync with `isPremium=true` via `syncToBlockchain`
- 🔐 Premium gating logic respected
- ⚠️ 400 on invalid input
- 🔥 500 on internal error

### GET /api/escrow/audit/logs
- ✅ Returns audit logs via `getEscrowStatus`
- ✅ Blockchain audit trail via `getBlockchainAuditTrail`
- ⚠️ 500 on query failure

### Other
- ✅ Logging via `logger.error`
- ⚙️ Rate-limiting placeholder (mocked in unit test)

## Dependencies
- `jest`
- `supertest`
- `@services/escrow/EscrowChainSync` (mocked)
- `@utils/logger` (mocked)
