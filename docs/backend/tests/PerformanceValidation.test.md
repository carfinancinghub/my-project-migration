# PerformanceValidation.ts – Test Documentation
** Path: docs/backend/tests/PerformanceValidation.test.md

**Test File:** `backend/tests/PerformanceValidation.ts`  
**Purpose:** Validates API performance (latency, errors, throughput) from `PerformanceTests.ts` against baseline thresholds in `performance_test.json`.

## Features Tested
- Parses JSON performance reports (automated)
- Validates each endpoint and scenario for:
    - Average/P95 response time
    - Error counts
    - Minimum completed requests
- Aggregates failures, saves detailed validation report
- Ready for CI/CD and alerting integration

## Test Scenarios
| Scenario                | Metric                        | Threshold/Behavior              |
|-------------------------|------------------------------|-------------------------------|
| Endpoint latency        | Avg/p95 latency               | < baseline max                |
| Error count             | Errors per endpoint/overall   | ≤ allowed threshold           |
| Completion count        | Requests processed            | ≥ minimum required            |
| Alert on failure        | Any threshold breached        | Email/Slack (Premium+)        |

## Tier Enhancements
- **Free:** Core validation, JSON output
- **Premium:** Slack/email alert, dashboard history
- **Wow++:** Custom thresholds per env, live CI badge, audit history

## Related Files
- `backend/tests/PerformanceTests.ts`
- `@_mocks/performance_test.json`
- `@utils/logger`
- `@utils/alert` (optional for alerting)
