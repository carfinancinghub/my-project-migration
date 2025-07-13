# 📢 Route: escrowNotifyRoutes.js

## Purpose
Escrow event notifier. Dispatches structured notifications and logs events to internal DB and optionally to blockchain.

## Endpoints

### POST /api/escrow/notify/:event
- Inputs:
  - transactionId (string, required)
  - userId (string, required)
  - metadata (object, optional)
  - isPremium (boolean, optional)
- Events:
  - deposit
  - release
  - dispute
- Outputs:
  - success flag
  - notificationId
  - blockchain audit (if premium)
  - status

## Dependencies
- `@services/escrow/EscrowChainSync`
- `@services/notification/WebSocketService`
- `@utils/logger`
- `@utils/validateQueryParams`
- `helmet`, `express-rate-limit`
