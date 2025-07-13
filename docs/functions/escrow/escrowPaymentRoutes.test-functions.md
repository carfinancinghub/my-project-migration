# ✅ Test Suite: escrowPaymentRoutes.test.js

## Purpose
Ensure escrow payment initiation and status retrieval endpoints work with blockchain and WebSocket integrations.

## Test Scenarios

### POST /api/escrow/pay/initiate
- ✅ Free: Initiates payment and logs with syncEscrowAction
- ✅ Premium: Includes blockchain audit + WebSocket push
- ❌ Invalid: Missing fields return HTTP 400
- ❌ Error: Blockchain or logging errors return HTTP 500

### GET /api/escrow/pay/status/:paymentId
- ✅ Free: Retrieves payment status
- ✅ Premium: Adds blockchain audit details
- ❌ Not Found: Returns HTTP 404
- ❌ Error: Blockchain error returns HTTP 500

## Dependencies
- `jest`, `supertest`
- `@services/escrow/EscrowChainSync` (mocked)
- `@services/notification/WebSocketService` (mocked)
- `@utils/logger`