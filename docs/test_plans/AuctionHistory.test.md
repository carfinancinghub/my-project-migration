<!--
 * © 2025 CFH, All Rights Reserved
 * File: AuctionHistory.test.md
 * Path: C:\cfh\docs\test_plans\AuctionHistory.test.md
 * Purpose: Test documentation/plan for AuctionHistory service (Crown Certified)
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-18 [0822]
 * Version: 1.0.1
 * Crown Certified: Yes
 * Related Test: C:\CFH\backend\tests\auction\AuctionHistory.test.ts
 * Related Service: @services/auction/AuctionHistory.ts
-->

# AuctionHistory.test.ts

## Purpose
Unit tests for `AuctionHistory` service, covering seller and bidder history retrieval and error/edge cases.

## Location
- Test file: `C:\CFH\backend\tests\auction\AuctionHistory.test.ts`
- Service: `@services/auction/AuctionHistory.ts`

## What is Tested

- `getSellerHistory`:
  - Retrieves history for seller with multiple auctions (sold, unsold).
  - Throws/logs error if no history found (null or empty).
- `getBidderHistory`:
  - Retrieves bidder’s bidding history, resolves auction info per bid.
  - Handles missing auctions (returns "Unknown Auction"/"Unknown" status).
  - Throws/logs error if no bid history found.

## Test Coverage Table

| Function         | Multiple Records | No Records (null) | No Records (empty) | Missing Linked Data | Edge/Boundary           |
|------------------|-----------------|-------------------|--------------------|---------------------|-------------------------|
| getSellerHistory | ✅              | ✅                | ✅                 | N/A                 | ⚠️ Malformed data*      |
| getBidderHistory | ✅              | ✅                | ✅                 | ✅                  | ⚠️ Malformed data*      |

> *Edge/Boundary: Suggest coverage for malformed/missing bid arrays or auction records.

## Gaps & Recommendations

- Extract mock types/interfaces to test utils for DRY and maintainability.
- Add tests for **malformed or corrupted data** (e.g., bad bids, missing fields).
- Consider additional edge tests for auctions with non-standard status or timestamps.
- Ensure consistent logging for all error paths.

## Upgrade Notes

- Document any changes to the auction/bidder data model or new history-related business logic here.

## Version/Changelog

- **v1.0.1** (2025-07-18): Initial test doc, Crown Certified.

---

## LEARNING SECTION

- **Why this .md doc?**
  - Clarifies how your auction history logic is validated and what edge/error cases are caught.
  - Prevents future code changes from breaking audit trails or user-facing history features.
  - Provides a checklist for onboarding new features or refactors.

---

*Keep using this approach for all user-facing and audit-critical features!*
