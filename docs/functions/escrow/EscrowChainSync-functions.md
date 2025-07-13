# 📘 EscrowChainSync.js — Function Summary

## Purpose
Synchronizes escrow activity to both internal DB and blockchain. Supports secure fund handling and audit trail generation for SmartContracts.

## Functions

### syncEscrowAction(actionData)
- Logs escrow events internally
- Input: `{ transactionId, actionType, userId, metadata }`
- Returns: `{ success: true, data: record }`

### syncToBlockchain(actionData)
- Premium: pushes escrow data to blockchain
- Output: `{ success: true, txHash }`

### getEscrowStatus(transactionId)
- Returns escrow record by ID
- Throws if not found

### getBlockchainAuditTrail(transactionId)
- Premium: returns blockchain audit receipt for record
- Output: `{ success: true, data: txDetails }`

## Dependencies
- `@models/Escrow`
- `@services/blockchain/BlockchainAdapter`
- `@utils/logger`
- `@utils/validateInput`
