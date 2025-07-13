# 📘 Test Suite: BuyerBidModal.test.jsx

## Purpose
Verify the functionality of `BuyerBidModal.jsx` including rendering logic, bid submission, AI recommendation rendering, error handling, and premium gating.

## Test Scenarios

### ✅ Free Tier Tests
- Renders modal when `isOpen=true`.
- Allows user to input and submit a bid.
- Disables submit button if bid is invalid or empty.
- Calls `onSubmit()` callback with correct bid amount.

### 💎 Premium Tier Tests
- Mocks `PredictionEngine.getRecommendation()` to return bid suggestion.
- Displays AI suggestion message (e.g., “AI Suggests: $3200”).
- Verifies conditional rendering of history/export components.
- Ensures `isPremium=false` hides premium features.

### ❌ Error Handling
- Simulates fetch error from `PredictionEngine` and validates fallback UI.
- Asserts that `logger.error` is called when fetching AI recommendation fails.

## Tools & Mocks
- `@testing-library/react`
- `vitest`
- `@services/ai/PredictionEngine` (mocked)
- `@utils/logger` (mocked)

## Version History
- **May 18, 2025** — Initial Crown Certified release with full coverage.
- **Planned Enhancements** — Add real-time WebSocket event validation once Wow++ overlay is implemented.

## Security
- **Sensitive**: no
