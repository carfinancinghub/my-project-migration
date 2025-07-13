# 📘 Route: escrowAuditLogRoutes.js

## Purpose
Handle escrow audit logging and blockchain trail access.

## Endpoints

### POST /api/escrow/audit/log
- Input: `transactionId`, `actionType`, `userId`, `metadata`, `isPremium` (query)
- Output: `{ dbLog, blockchain? }`
- Gated: Only syncs to blockchain if `isPremium=true`

### GET /api/escrow/audit/logs
- Input: `transactionId` or `userId`, `isPremium` (query)
- Output: `{ logs, auditTrail? }`
- Gated: Only returns `auditTrail` if `isPremium=true`

## Dependencies
- `@services/escrow/EscrowChainSync`
- `@utils/logger`
- `@utils/validateQueryParams`
- `helmet`, `express-rate-limit`