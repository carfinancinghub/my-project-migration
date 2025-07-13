# 📘 Service: ValuationMetricsService.js — Valuation Metrics Service

## Purpose
Provides backend valuation metrics for auctions, integrating with PredictionEngine for real-time insights.

## Methods

### 🟢 calculateValuationMetrics
- **Input**:
  - `auctionId`: string (required)
  - `isPremium`: boolean (required)
- **Output**:
  ```json
  {
    "data": {
      "estimatedValue": number,
      "advancedMetrics": { /* premium-only */ }
    }
  }


Logic: Calculates average bid value, with premium advanced metrics (title delay, escrow timing, market trend).

🟢 subscribeToLiveUpdates

Input:

auctionId: string (required)

Output:

{ "data": { "subscriptionId": string } }

Logic: Subscribes to live valuation updates via WebSocket.

Dependencies

@models/Auction

@models/Bid

@services/ai/PredictionEngine

@utils/logger

Notes

Fully Crown Certified for valuation metrics.

Error handling for missing inputs and auction not found.

Premium gating for advanced metrics.