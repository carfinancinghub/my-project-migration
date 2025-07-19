<!--
© 2025 CFH, All Rights Reserved
File: PerformanceTests.md
Path: docs/backend/tests/PerformanceTests.md
Purpose: Test plan and documentation for PerformanceTests.ts (API load/performance)
Author: Cod1 Team
Date: 2025-07-18 [0840]
Version: 1.0.1
Crown Certified: Yes
Batch ID: Compliance-071825
Artifact ID: 9p8o7i6u5y4t3r2e1w0q9a8s7d6f5g4h
Save Location: docs/backend/tests/PerformanceTests.md
-->

# PerformanceTests Test Documentation

## Overview

`PerformanceTests.ts` provides automated load and performance testing for core backend API endpoints, including listing, storage, and notification routes.

## Test File Location

- Code: `backend/tests/PerformanceTests.ts`
- Docs: `docs/backend/tests/PerformanceTests.md`

## Features & Scenarios

| Scenario                          | Endpoint/Target                           | Expected Outcome                                      |
|------------------------------------|-------------------------------------------|------------------------------------------------------|
| Steady load on listings            | GET `/api/listings`                       | Measures response time, throughput, and error rate    |
| Storage endpoint stress            | GET `/api/storage/:hostId`                | Validates speed and stability under load              |
| Notification retrieval             | GET `/api/notifications/:userId`          | Monitors delivery latency and API resilience          |
| Notification post                  | POST `/api/notifications/:userId`         | Ensures message creation at scale                     |
| Spike load scenario                | Configurable via environment              | Evaluates handling of sudden traffic increase         |
| Retry logic on transient failures  | All                                      | Verifies test robustness and recovery                 |
| JWT/auth simulation                | All                                      | Ensures requests are authorized during testing        |

## Test Improvements

- **Free**: Baseline performance validation, errors captured.
- **Premium**: Alerting, trend analysis, and historical reporting.
- **Wow++**: Customizable test profiles, real-time performance dashboards, integration with Slack/email alerts.

## File Outputs

- Artillery/YAML config: `backend/tests/artillery_config.yml`
- Test results: `backend/tests/artillery_report.json`
- Performance report: `backend/tests/performance_report.json`

## Coverage Recommendations

- Add more endpoints to the scenarios for broader coverage.
- Automate performance tests in CI/CD on every deploy.
- Export test metrics to analytics dashboard for product/infra review.

## Related Files

- `backend/tests/PerformanceTests.ts`
- `backend/tests/PerformanceValidation.ts`
- `@utils/logger`
- Artillery/other load test dependencies

---

*CFH Cod1: This test documentation ensures all performance-critical endpoints are covered and reporting is actionable for both tech and product teams. Contact the QA team for improvement or automation suggestions.*
