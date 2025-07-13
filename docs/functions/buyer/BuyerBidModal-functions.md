# 📘 Component: BuyerBidModal.jsx

## Purpose
Provides a modal interface for buyers to place bids on auctions. Integrates AI-powered suggestions and history display for premium users to enhance strategic decision-making.

## Inputs
- `auctionId` (string, required): The auction identifier.
- `isOpen` (boolean, required): Controls modal visibility.
- `onClose` (function, required): Callback to close the modal.
- `onSubmit` (function, required): Callback for submitted bids.
- `isPremium` (boolean, required): Enables premium logic.

## Outputs
- JSX Modal Interface with:
  - Bid amount input and submit button (free).
  - AI-powered bid recommendation (premium).
  - Exportable bidding history (premium).

## Features

### ✅ Free Tier
- Manual bid entry and submission.
- Error handling for empty or invalid bids.

### 💎 Premium Tier
- Fetches AI recommendation using `PredictionEngine.getRecommendation()`.
- Displays recent bidding history in graphical format.
- Intelligent suggestion rendering (“AI Suggests: $3200”).

### 🚀 Wow++ (Planned)
- Real-time competitor bid analysis overlay.
- Integration with SmartInsightsWidget for probability feedback.

## Dependencies
- `React`, `PropTypes`
- `@services/ai/PredictionEngine`
- `@utils/logger`
- `@components/common/Tooltip`, `@components/common/ChartBar`

## Version History
- **May 18, 2025** — Initial SG Man–compliant release.
- **Planned Enhancements** — Wow++ AI overlays and competitive bid tracking.

## Security
- **Sensitive**: no
