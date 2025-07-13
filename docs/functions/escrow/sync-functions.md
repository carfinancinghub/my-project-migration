# 📘 Route: sync.js — Escrow Chain Sync API

## Purpose
Expose secure escrow endpoints for syncing to DB/blockchain and retrieving status or audit trail.

---

## Endpoints

### 🟢 POST /api/escrow/sync
- **Input**:
  - `body`: `{ transactionId, actionType, userId, metadata }`
  - `query`: `isPremium` (boolean)
- **Output**:
  ```json
  {
    "record": { ... },
    "blockchain": { ... } // Only if premium
  }
