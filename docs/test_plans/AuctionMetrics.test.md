<!--
 * © 2025 CFH, All Rights Reserved
 * File: AuctionMetrics.test.md
 * Path: C:\cfh\docs\test_plans\AuctionMetrics.test.md
 * Purpose: Test documentation/plan for AuctionMetrics service (Crown Certified)
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-18 [0816]
 * Version: 1.0.1
 * Crown Certified: Yes
 * Related Test: C:\CFH\backend\tests\auction\AuctionMetrics.test.ts
 * Related Service: @services/auction/AuctionMetrics.ts
-->

# AuctionMetrics.test.ts

## Purpose
Unit and integration tests for the `AuctionMetrics` service, covering key metric calculations for auction data and error handling scenarios.

## Location
- Test file: `C:\CFH\backend\tests\auction\AuctionMetrics.test.ts`
- Service: `@services/auction/AuctionMetrics.ts`

## What is Tested

- `calculateMetrics`:
  - Success path: computes total bids, highest/average bid, increment, reserve met, and duration.
  - Handles auctions with no bids (all zeroes, reserve not met).
  - Throws and logs error if auction not found.
- `aggregateMetrics`:
  - Success path: aggregates across all auctions for seller (total, active, revenue, avg bid).
  - Handles case where no auctions found (throws/logs).
  - Handles auctions with no bids (avg bid = 0).

## Test Coverage Table

| Function           | Success Path | No Data | Error/Not Found | Edge/Boundary      |
|--------------------|-------------|---------|-----------------|--------------------|
| calculateMetrics   | ✅          | ✅      | ✅              | ⚠️ Corrupted data* |
| aggregateMetrics   | ✅          | ✅      | ✅              | ⚠️ Corrupted data* |

> *Edge/Boundary column flags what’s suggested but not yet implemented.

## Gaps & Recommendations

- Add tests for **corrupted or malformed auction objects** (e.g., missing bids array, bad dates)
- Move repeated mock data/types to shared test utils
- Integrate Zod/Joi validation in the service and test invalid input
- Add tests for negative/invalid path (e.g., unexpected object structure)
- Add test for extreme edge case: auction spanning zero or negative duration

## Upgrade Notes

- As you extend metrics or add tiers (Premium/Wow++), document feature coverage and business logic in this doc for future maintainers.

## Version/Changelog

- **v1.0.1** (2025-07-18): Initial test doc, Crown Certified.

---

## LEARNING SECTION

- **Why this .md doc?**  
  - It serves as both a map and a contract for what your tests actually cover.
  - Makes it easier for new team members or auditors to understand the business logic and edge cases without spelunking into test code.
  - Helps catch “test drift” (feature/test gaps as service evolves).

---

*Continue with this pattern for each .test file and main backend route for production-grade documentation and auditability!*
