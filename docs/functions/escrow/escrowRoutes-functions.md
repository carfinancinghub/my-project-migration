# 📘 Functions Summary — escrowRoutes.js

## Purpose
Central router for all escrow-related routes under `/api/escrow`. Handles sync, audit, notify, and payment services with modular delegation and SG Man standard protections.

## Inputs
- Standard Express request object:
  - `req.body` (e.g., transactionId, metadata)
  - `req.query.isPremium` (optional Boolean)
  - `req.params` (e.g., transactionId)

## Outputs
- JSON response:
  ```json
  {
    "success": true,
    "data": { ... },
    "version": "v1"
  }
Dependencies
express

helmet (security headers)

express-rate-limit (DoS protection)

@utils/logger

@utils/validateQueryParams

@routes/escrow/sync

@routes/escrow/escrowAuditLogRoutes

@routes/escrow/escrowNotifyRoutes

@routes/escrow/escrowPaymentRoutes

Features
✅ Modular delegation to escrow subroutes

✅ Rate limiting and helmet protection

✅ Logging for unsupported or invalid routes

✅ Premium endpoint compatibility (isPremium query param)

✅ Reusable across buyers, sellers, officers