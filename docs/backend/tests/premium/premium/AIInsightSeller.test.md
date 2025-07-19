<!--
File: AIInsightSeller.test.md
Path: docs/backend/tests/premium/AIInsightSeller.test.md
Purpose: Test plan/spec for AIInsightSeller.test.ts (AI-driven seller insights & strategy)
Author: Cod1 Team
Date: 2025-07-19 [0026]
Version: 1.0.1
Crown Certified: Yes
Batch ID: Compliance-071925
Save Location: docs/backend/tests/premium/AIInsightSeller.test.md
-->

# AIInsightSeller Test Specification

## Purpose
Test suite for AIInsightSeller premium service. Ensures reserve price optimization and seller performance insights.

## Tested Features

- `optimizeReservePrice`
  - Optimizes reserve for premium user
  - Fails for non-premium
  - Fails if auction not found
  - Validates correct use of market price data and AI

- `getSellerPerformance`
  - Returns seller auction insights (total, successful, avg. bid)
  - Fails for non-premium user
  - Fails if no auctions

## Test Structure

- Positive/negative flows for both methods
- Mocks for DB, AI, and logger
- Asserts output and log calls

## Free
- Basic seller insight test

## Premium
- Market trend/strategy tests

## Wow++
- Predictive bidding simulations, profile completeness scoring, explainable AI output (future roadmap)
