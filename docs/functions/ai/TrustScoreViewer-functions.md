# 📘 Component: TrustScoreViewer.jsx — Trust Score Viewer

## Purpose
User-facing component to display a user's trust score and premium breakdown with trend insights.

## Features

### 🟢 Trust Score (Free)
- Displays trust score based on `calculateTrustScore`.
- Fetched via API call to TrustScoreEngine.

### 🔒 Breakdown and Trend (Premium)
- Shows detailed trust breakdown and trend via `calculateTrustScore` and `predictTrustTrend`.
- Gated with PremiumGate, displays upsell prompt for non-premium users.

## Props
- `userId`: string (required)
- `isPremium`: boolean (required)

## Dependencies
- `react`
- `prop-types`
- `@services/api`
- `@utils/logger`
- `@components/common/PremiumGate`
- `lucide-react`

## Notes
- Fully Crown Certified for trust score display.
- Error handling for API failures and invalid inputs.
- Premium gating enforced for breakdown and trend insights.