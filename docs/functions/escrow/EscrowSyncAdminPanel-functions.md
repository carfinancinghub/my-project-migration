# 📘 Component: EscrowSyncAdminPanel.jsx — Escrow Sync Admin Dashboard

## Purpose
Admin-facing dashboard for managing escrow actions, viewing transaction statuses, and accessing blockchain audit trails (premium-only).

## Features

### 🟢 Transaction List
- Displays table of escrow transactions (`transactionId`, `actionType`, `userId`, `status`, `createdAt`).
- Supports pagination and sorting via `DataTable`.
- Shows urgency indicators (⏳) for pending actions.

### 🟢 Sync Form
- Form to trigger `POST /api/escrow/sync` with inputs:
  - `transactionId` (text, required)
  - `actionType` (text, required)
  - `userId` (text, required)
  - `metadata` (JSON textarea)
  - `isPremium` (checkbox, premium-only)

### 🔵 Status View
- Fetches real-time status via `GET /api/escrow/status/:transactionId`.
- Includes refresh button for updates.

### 🔒 Audit Trail (Premium)
- Displays blockchain audit trail via `GET /api/escrow/audit/:transactionId` in a collapsible panel.
- Gated with `PremiumGate`, shows upsell prompt for non-premium users.

## Props
- `userId`: string (required)
- `isPremium`: boolean (required)

## Dependencies
- `react`
- `prop-types`
- `@components/common/DataTable`
- `@components/common/Form`
- `@components/common/PremiumGate`
- `@services/api`
- `@utils/logger`
- `lucide-react`

## Notes
- Fully Crown Certified for secure escrow management.
- Error handling for API failures and invalid inputs.
- Premium gating enforced for blockchain sync and audit trail access.