<!--
File: StartAuctionForm.md
Path: docs/frontend/src/components/seller/StartAuctionForm.md
Purpose: Documentation/spec for StartAuctionForm.tsx – auction listing form component.
Author: Cod1 Team (with CFH review)
Date: 2025-07-18 [0825]
Version: 1.0.0
Crown Certified: Yes
Save Location: docs/frontend/src/components/seller/StartAuctionForm.md
-->

# StartAuctionForm Component Spec

## Purpose
Form UI for sellers to start a vehicle auction, providing starting price and auction duration. Integrates validation, toasts, and API.

## Features
- Typed with TypeScript, props/state checked.
- Validates starting price and duration with `@validation/auction.validation`.
- Modular API via `@services/auction`.
- Auth token check (context or localStorage, recommend context).
- Loading and error state UX, toasts.
- Debounce prevention for rapid clicks.
- Accessibility: ARIA labels, error messaging.

## Inputs
- `carId` (string): The vehicle being listed.

## Behavior
- User enters price/duration; form validates on submit.
- API call to `startAuction` with error handling and toast feedback.
- Disabled submit while loading.

## Tiered Feature Suggestions
- **Premium:** Priority auction slot, dynamic starting price suggestion, advanced analytics on similar auctions.
- **Wow++:** AI reserve price optimizer, automatic relisting, bulk auction listing tool.

## Testing & QA
- Recommend RTL/Jest test in `frontend/tests/components/seller/StartAuctionForm.test.tsx`:
  - Input validation (empty, invalid values)
  - API error simulation
  - Success toast and UI reset
  - Debounce (double-click test)
  - Accessibility assertions

## Improvements
- Replace localStorage with React context/provider for auth.
- Add controlled UI components for all form elements.
- Expose form completion analytics to admin dashboard.
- Add real-time form validation feedback.

---

_Last updated: 2025-07-18 [0825], Cod1/CFH Dev Team_
