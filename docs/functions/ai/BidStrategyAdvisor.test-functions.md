// 👑 Crown Certified — Functions Summary  
**File**: BidStrategyAdvisor.test.jsx  
**Path**: frontend/src/tests/ai/BidStrategyAdvisor.test.jsx  
**Author**: Rivers Auction Team  
**Date**: May 17, 2025  
**Cod2 Crown Certified**

## Purpose  
Test the rendering and behavior of BidStrategyAdvisor.jsx for both free and premium users. Validate AI-driven logic and error handling.

---

## What It Tests  
- Proper rendering of suggestion text based on `auctionId`, `userId`, and `isPremium`  
- Loading and error states  
- Premium-only features: performance trend graph, risk index, and confidence percentage  
- Proper call to mocked `PredictionEngine`  
- Gating of features if `isPremium = false`  
- Logging of failed prediction fetches

---

## Dependencies  
- `@services/ai/PredictionEngine` (mocked)  
- `@utils/logger` (mocked)  
- `@components/ai/BidStrategyAdvisor`  
- `@testing-library/react`, `vitest`, `@testing-library/jest-dom`  

---

## SG Man Standards  
- Crown Certified header  
- Uses mocks for all external services  
- Covers premium and error edge cases  
- Test ID targeting for accessibility and CI  

 Next Step: Save this file as:
pgsql
Copy
C:\CFH\docs\functions\ai\BidStrategyAdvisor.test-functions.md
✅ Final Dispatch Summary (for your records)
File	Path	Size (approx.)
BidStrategyAdvisor.jsx	frontend/src/components/ai/	2683 B
BidStrategyAdvisor.test.jsx	frontend/src/tests/ai/	~3000–3500 B
BidStrategyAdvisor-functions.md	docs/functions/ai/	~1200–1500 B
BidStrategyAdvisor.test-functions.md	docs/functions/ai/	~1200–1500 B

Batch: AIValuation-051825, SupportTools-051825