# 📘 Component: EscrowStatusViewer.jsx — Escrow Status Viewer

## Purpose
User-facing component to view escrow transaction status and blockchain audit trail (premium-only).

## Features

### 🟢 Transaction Status
- Displays transaction details (`transactionId`, `actionType`, `userId`, `status`, `createdAt`).
- Shows urgency indicators (⏳) for pending transactions.

### 🔒 Audit Trail (Premium)
- Fetches blockchain audit trail via `GET /api/escrow/audit/:transactionId` on button click.
- Gated with `PremiumGate`, shows upsell prompt for non-premium users.

## Props
- `transactionId`: string (required)
- `isPremium`: boolean (required)

## Dependencies
- `react`
- `prop-types`
- `@services/api`
- `@utils/logger`
- `@components/common/PremiumGate`
- `lucide-react`

## Notes
- Fully Crown Certified for secure escrow status viewing.
- Error handling for API failures and non-premium access.
- Premium gating enforced for audit trail access.