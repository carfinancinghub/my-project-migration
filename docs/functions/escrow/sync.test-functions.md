# 📘 Test Suite: sync.test.js — Escrow Route API

## Purpose
Test escrow syncing routes (`/sync`, `/status`, `/audit`) for both free and premium access paths.

## Test Scenarios

### POST /sync
- ✅ Syncs DB (free)
- ✅ Syncs blockchain (premium)
- ✅ 400 for invalid query params
- ✅ 500 on DB or chain failure

### GET /status/:transactionId
- ✅ Returns escrow status
- ✅ 500 if DB throws

### GET /audit/:transactionId
- ✅ Returns blockchain audit if `isPremium=true`
- ✅ 403 if not premium
- ✅ 500 if chain fails

## Tools & Dependencies
- `jest`, `supertest`
- `@services/escrow/EscrowChainSync` (mocked)
- `@utils/logger`
