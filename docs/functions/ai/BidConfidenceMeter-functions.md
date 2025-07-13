# 📘 Component: BidConfidenceMeter.jsx — Bid Confidence Meter

## Purpose
User-facing component to display a confidence score for bid success probability and premium bidding advice.

## Features

### 🟢 Confidence Score (Free)
- Displays bid success probability based on `getBasicPrediction`.
- Fetched via API call to PredictionEngine.

### 🔒 Bidding Advice (Premium)
- Shows bidding advice via `getRecommendation` on button click.
- Gated with PremiumGate, displays upsell prompt for non-premium users.

## Props
- `auctionId`: string (required)
- `bidAmount`: number (required)
- `isPremium`: boolean (required)

## Dependencies
- `react`
- `prop-types`
- `@services/api`
- `@utils/logger`
- `@components/common/PremiumGate`
- `lucide-react`

## Notes
- Fully Crown Certified for bid confidence display.
- Error handling for API failures and invalid inputs.
- Premium gating enforced for bidding advice.