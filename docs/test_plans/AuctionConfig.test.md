<!--
 * © 2025 CFH, All Rights Reserved
 * File: AuctionConfig.test.md
 * Path: C:\cfh\docs\test_plans\AuctionConfig.test.md
 * Purpose: Test documentation/plan for AuctionConfig module (Crown Certified)
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-18 [0820]
 * Version: 1.0.1
 * Crown Certified: Yes
 * Related Test: backend/tests/config/AuctionConfig.test.ts
 * Related Config: @config/AuctionConfig.ts
-->

# AuctionConfig.test.ts

## Purpose
Unit tests for auction configuration logic (bid increments, auction durations, config validation), covering all supported auction types and fallback logic.

## Location
- Test file: `backend/tests/config/AuctionConfig.test.ts`
- Config module: `@config/AuctionConfig.ts`

## What is Tested

- `getBidIncrement`:
  - Returns correct increment for standard and premium auctions.
  - Returns default for invalid auction type.
- `getAuctionDuration`:
  - Returns correct duration for standard and premium.
  - Returns default for invalid type.
- `validateConfig`:
  - Returns true for default settings.
- **Negative path**:
  - Ensures default values for unrecognized auction types.

## Test Coverage Table

| Function           | Standard | Premium | Invalid Type | Edge/Boundary         |
|--------------------|----------|---------|-------------|-----------------------|
| getBidIncrement    | ✅       | ✅      | ✅          | ⚠️ Undefined/null     |
| getAuctionDuration | ✅       | ✅      | ✅          | ⚠️ Malformed input    |
| validateConfig     | ✅       | N/A     | N/A         | ⚠️ Advanced coverage* |

> *Suggest adding coverage for config validation failures if config becomes user-editable.

## Gaps & Recommendations

- Add edge-case tests for **undefined, null, or malformed input**.
- Move shared configuration test data to test utils.
- Integrate input schema validation (with `@validation/config.validation`) if settings are exposed to users/admins.
- If/when adding new auction types or config parameters, expand tests accordingly.

## Upgrade Notes

- As auction types or tiers expand (e.g., custom, instant), update both config logic and tests, and document here.

## Version/Changelog

- **v1.0.1** (2025-07-18): Initial config test doc, Crown Certified.

---

## LEARNING SECTION

- **Why this .md doc?**
  - Documents exactly what business rules and defaults are enforced for auction configs.
  - Explicit edge-case tracking helps prevent config regression bugs.
  - Mapping test coverage ensures new auction types/features are never missed in tests.

---

*Use this template for all config modules or files with business-critical default logic!*
