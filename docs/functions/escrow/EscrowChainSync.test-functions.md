# 📘 Test Suite: EscrowChainSync.test.js

## Purpose
Ensure escrow and blockchain syncing logic is secure, auditable, and gated by premium access.

## Test Scenarios

### Free Tier
- ✅ syncEscrowAction(): Inserts to DB, handles validation + DB failure
- ✅ getEscrowStatus(): Returns escrow state or throws for missing record

### Premium Tier
- ✅ syncToBlockchain(): Successful blockchain write and txHash return
- ✅ getBlockchainAuditTrail(): Returns blockchain receipt or throws if not found

### Global
- ✅ logger.error on all caught exceptions
- ✅ Mocked dependencies: Escrow model, BlockchainAdapter
- ✅ Edge case and failure coverage

## Tools & Dependencies
- `jest`
- `@models/Escrow` (mocked)
- `@services/blockchain/BlockchainAdapter` (mocked)
- `@utils/logger` (monitored)