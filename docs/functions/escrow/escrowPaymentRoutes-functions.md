# 💸 Route: escrowPaymentRoutes.js

## Purpose
Manage escrow payment flows, including initiation and confirmation. Integrates blockchain audit syncing via `EscrowChainSync`.

## Endpoints

### POST /api/escrow/payment/initiate
- Inputs:
  - transactionId (string, required)
  - buyerId (string, required)
  - amount (number, required)
  - isPremium (boolean, optional)
- Outputs:
  - status = "initiated"
  - audit logs (db and blockchain if premium)

### POST /api/escrow/payment/confirm
- Inputs:
  - transactionId (string, required)
  - officerId (string, required)
  - confirmationNote (string, optional)
  - isPremium (boolean, optional)
- Outputs:
  - status = "confirmed"
  - audit logs (db and blockchain if premium)

## Dependencies
- `@utils/logger`
- `@utils/validateQueryParams`
- `@services/escrow/EscrowChainSync`
- `helmet`, `express-rate-limit`
