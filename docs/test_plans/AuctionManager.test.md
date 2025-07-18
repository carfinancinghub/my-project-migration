<!--
 * © 2025 CFH, All Rights Reserved
 * File: AuctionManager.test.md
 * Path: C:\cfh\docs\test_plans\AuctionManager.test.md
 * Purpose: Test documentation/plan for AuctionManager service (Crown Certified)
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-18 [0824]
 * Version: 1.0.1
 * Crown Certified: Yes
 * Related Test: C:\CFH\backend\tests\auction\AuctionManager.test.ts
 * Related Service: @services/auction/AuctionManager.ts
-->

# AuctionManager.test.ts

## Purpose
Unit tests for the `AuctionManager` service, covering auction lifecycle operations (start, end, bid placement) and their error/edge cases.

## Location
- Test file: `C:\CFH\backend\tests\auction\AuctionManager.test.ts`
- Service: `@services/auction/AuctionManager.ts`

## What is Tested

- `startAuction`:
  - Starts pending auction and sets status to active.
  - Returns already active status if auction is already active.
  - Throws/logs error when auction not found.
- `endAuction`:
  - Ends auction as sold (bid meets/exceeds reserve).
  - Ends auction as unsold (bid below reserve).
  - Handles not-active auction.
  - Throws/logs error when auction not found.
- `placeBid`:
  - Places bid successfully for active auction.
  - Throws error when auction not active.
  - Throws error when auction not found.

## Test Coverage Table

| Function       | Success | Not Found | Invalid State | Edge/Boundary         |
|----------------|---------|-----------|--------------|-----------------------|
| startAuction   | ✅      | ✅        | ✅ (already)  | ⚠️ Permission/invalid |
| endAuction     | ✅      | ✅        | ✅ (not active)| ⚠️ Multiple winners   |
| placeBid       | ✅      | ✅        | ✅ (not active)| ⚠️ Overlapping bids   |

> *Edge/Boundary: Suggest adding tests for invalid permissions, race conditions, or multiple bidders at once.

## Gaps & Recommendations

- Extract reusable test data to a shared test utils module.
- Add tests for edge cases: permission denied, rapid state changes, duplicate bids.
- Use `@validation/auction.validation` to enforce strong input schemas and add corresponding negative-path tests.

## Upgrade Notes

- If auction workflow expands (multi-stage, escrow integration), update both service and tests, and document changes here.

## Version/Changelog

- **v1.0.1** (2025-07-18): Initial test doc, Crown Certified.

---

## LEARNING SECTION

- **Why this .md doc?**
  - Ensures all critical business rules and state transitions are validated by tests.
  - Documents what concurrency or permission issues are anticipated.
  - Provides a quick reference for onboarding and compliance reviews.

---

*Apply this documentation approach to all business logic services that touch money or critical user state!*
