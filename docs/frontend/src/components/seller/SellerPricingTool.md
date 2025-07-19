<!--
© 2025 CFH, All Rights Reserved
File: SellerPricingTool.md
Path: docs/frontend/src/components/seller/SellerPricingTool.md
Purpose: Documentation for SellerPricingTool component – pricing suggestion for vehicle sellers
Author: Cod1 Team
Date: 2025-07-18 [0815]
Version: 1.0.1
Crown Certified: Yes
Batch ID: Compliance-071825
Artifact ID: q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6
Save Location: docs/frontend/src/components/seller/SellerPricingTool.md
-->

# SellerPricingTool Component Documentation

## Overview
`SellerPricingTool.tsx` is a TypeScript React component for sellers to receive AI-powered pricing suggestions based on car make, model, and year. It leverages debounce logic to minimize API calls, uses form validation, and provides an accessible interface.

---

## Key Features
- **Typed State**: For make, model, year, suggestedPrice, loading, and error.
- **Validation**: Uses `@validation/pricing.validation` for client-side input checks.
- **Service Integration**: Fetches price suggestions from `@services/pricing`.
- **Debounced Input**: Reduces API calls when typing (lodash debounce).
- **Accessibility**: Proper ARIA attributes, keyboard navigation.
- **User Feedback**: Error and loading indicators.
- **Currency Formatting**: Price is displayed with commas.

---

## Core Logic & Behavior

- **debouncedFetch**:
  - Waits for input pause before calling API.
  - Validates make/model/year.
  - Retrieves token from `localStorage` (context preferred for production).
  - Sets error or displays suggested price.
- **useEffect**:
  - Triggers fetch on input changes, cleans up on component unmount.
- **Input Controls**:
  - All form fields are typed and managed as controlled components.

---

## Usage Example

```tsx
<SellerPricingTool />
Tiered Features (Freemium Model)
Tier	Features
Free	Base pricing tool, validation, suggestion output
Premium	Auto-suggest for make/model fields, price trend analytics
Wow++	AI-powered negotiation coaching, live market feed integration

Suggestions for Further Improvement
Move to a context-based authentication system for API calls.

Add auto-suggest dropdowns for make/model.

Integrate pricing trends for premium users.

Add accessibility audit (Jest-Axe).

Unit tests: see __tests__/components/seller/SellerPricingTool.test.tsx.

Related Files
frontend/src/components/seller/SellerPricingTool.tsx

@services/pricing

@validation/pricing.validation

__tests__/components/seller/SellerPricingTool.test.tsx (suggested)

CFH Cod1: For improvement suggestions or audit, contact the product team.

yaml
Copy
Edit
