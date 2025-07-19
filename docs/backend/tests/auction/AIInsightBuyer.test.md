<!--
File: AIInsightBuyer.test.md
Path: docs/backend/tests/auction/AIInsightBuyer.test.md
Purpose: Test plan/spec for AIInsightBuyer.test.ts (AI-powered buyer insights and strategy)
Author: Cod1 Team
Date: 2025-07-19 [0029]
Version: 1.0.1
Crown Certified: Yes
Batch ID: Compliance-071925
Save Location: docs/backend/tests/auction/AIInsightBuyer.test.md
-->

# AIInsightBuyer Test Specification

## Purpose
Ensures the AIInsightBuyer service gives premium buyers actionable recommendations, risk analysis, and bidding strategy during auctions.

## Tested Features

- `getBidRecommendations`
  - Returns strategy for premium user
  - Handles invalid/non-premium user
  - Fails if auction not found
  - Edge: extreme bids or high volatility

- `getRiskAnalysis`
  - Delivers risk scoring for current auction
  - Handles missing data

## Test Structure

- Mocks for DB/AI/service
- Positive/negative tests per method
- Coverage for both basic and premium access

## Free
- Basic insights (e.g. risk warnings)

## Premium
- AI-powered bid recommendations

## Wow++
- Real-time in-auction coaching, volatility detection, explainable AI (future)

## Additional Suggestions
- Add E2E with live auction flow for coaching popup
- Integrate with auction analytics dashboard
