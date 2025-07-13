# ✅ Test Suite: ValuationAssistant.test.jsx

## Purpose
Verify AI valuation rendering logic, premium feature gating, error states, and response handling in `ValuationAssistant`.

## Test Scenarios

### 🎯 Free Users
- ✅ Renders estimated value from prediction API
- ❌ No recommendation or chart shown

### 💎 Premium Users
- ✅ Renders predictive trends chart (`PredictiveGraph`)
- ✅ Displays bidding recommendation (`AI Suggests:`)

### ⚠️ Error Handling
- ✅ Handles API rejection and logs error using `logger.error`

### 🚫 Access Gating
- ✅ Shows locked message if recommendation attempted without premium

## Dependencies
- `@components/ai/ValuationAssistant`
- `@services/api` (mocked)
- `@utils/logger` (mocked)
- `@testing-library/react`
- `jest`

## Author
Rivers Auction Team — May 17, 2025