// 👑 Crown Certified — Functions Summary  
**File**: BidStrategyAdvisor.jsx  
**Path**: frontend/src/components/ai/BidStrategyAdvisor.jsx  
**Author**: Rivers Auction Team  
**Date**: May 17, 2025  
**Cod2 Crown Certified**

## Purpose  
Provide AI-driven bid strategy suggestions for buyers during live and upcoming auctions. Includes bid range, confidence levels, and premium performance analytics.

---

## Inputs  
- `auctionId` (string, required): ID of the auction  
- `userId` (string, required): ID of the current user  
- `isPremium` (boolean, required): Premium access flag

---

## Outputs  
- JSX.Element  
  - Renders bid strategy box with recommended min/max bid range  
  - Includes AI badge and premium content gating  
  - Graphs and visual indicators if premium is active

---

## Features  
- ✅ **Free Tier**:  
  - Real-time bid strategy suggestion  
  - AI badge display  
  - Confidence color bar

- 💎 **Premium Tier**:  
  - Confidence percentage (AI trust score)  
  - Bid performance trend graph  
  - Risk indicator & market competitiveness band  
  - Tooltip-based explanations

- 🚀 **Wow++ Additions**:  
  - Integrates with `PredictionEngine.js` for dynamic logic  
  - Shows bid window refresh countdown  
  - Can be embedded inline or modal  

---

## Dependencies  
- `@utils/logger`  
- `@services/ai/PredictionEngine`  
- `@components/common/PremiumGate`  
- `PropTypes`, `React`, `useEffect`, `useState`

---
