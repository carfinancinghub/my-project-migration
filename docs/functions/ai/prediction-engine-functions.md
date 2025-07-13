# 👑 Crown Certified — Functions Summary  
**File**: PredictionEngine.js  
**Path**: backend/services/ai/PredictionEngine.js  
**Author**: Rivers Auction Team  
**Date**: May 16, 2025  
**Cod2 Crown Certified**  

## Purpose  
Provides AI-driven predictions and actionable recommendations to optimize auction bidding, title processing, and escrow sync operations. Supports SmartInsightsWidget and other decision-making tools across buyer, seller, and officer roles.

## Functions

### 1. getBasicPrediction(inputData)
- **Purpose**: Provides free-tier predictions for bid success probability based on historical auction and bid data.
- **Inputs**:
  - `auctionId` (string, required)
  - `bidAmount` (number, required)
- **Outputs**:
  ```json
  {
    "success": true,
    "data": { "prediction": { /* success probability */ } },
    "version": "v1"
  }
2. getAdvancedPrediction(inputData)
Purpose: Provides premium-only advanced predictions for title processing and escrow sync timing.

Inputs:

auctionId (string, required)

userId (string, required)

Outputs:

json
Copy
{
  "success": true,
  "data": {
    "prediction": {
      "titleProcessingDelay": "...",
      "escrowSyncTiming": "..."
    }
  },
  "version": "v1"
}
3. getRecommendation(inputData)
Purpose: Premium-only AI-driven strategic recommendation (e.g., bid increase, title delay avoidance).

Inputs:

auctionId (string, required)

bidAmount (number, required)

Outputs:

json
Copy
{
  "success": true,
  "data": {
    "recommendation": {
      "message": "Increase bid by 5% to improve winning odds"
    }
  },
  "version": "v1"
}
Premium Gating
getAdvancedPrediction and getRecommendation are only available when isPremium === true.

Dependencies
@utils/logger

@models/Auction

@models/Bid

@models/Escrow

@services/ai/MLModel

Error Handling
Missing parameters → returns structured failure with success: false

logger.error logs all model/DB prediction failures

Fallback structure used for robustness

Notes
All prediction methods return standard format { success, data, version }

Modular service logic allows reuse in APIs and test files