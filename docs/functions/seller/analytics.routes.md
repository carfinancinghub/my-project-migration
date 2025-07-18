<!--
 * © 2025 CFH, All Rights Reserved
 * File: analytics.routes.md
 * Path: C:\cfh\docs\functions\seller\analytics.routes.md
 * Purpose: Documentation/spec/test plan for analytics.routes.ts (Analytics Dashboard API route)
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-17 [1149]
 * Version: 1.0.1
 * Crown Certified: Yes
 * Related File: backend/routes/analytics/analytics.routes.ts
 * Related Test: backend/routes/analytics/__tests__/analytics.routes.test.ts
-->

# analytics.routes.ts

## Purpose
Defines Express API endpoints for the Analytics Dashboard, providing secure, tiered access to analytics reports, export functionality, and notification integration.

## Location
`backend/routes/analytics/analytics.routes.ts`

## Main Features
- **Secure JWT authentication** and subscription tier validation (Free, Premium, Wow++).
- **/reports/custom:** (Premium) Generate custom analytics report for a user.
- **/reports/:reportId/export:** (Wow++) Export analytics report in Tableau format.
- **/notify:** Queue a notification related to analytics (for internal/admin use).
- **Validation:** All endpoints use Joi schemas for payload validation.
- **Audit Logging:** All critical actions are logged via audit service.

## Endpoints

| Method | Endpoint                         | Tier      | Description                                        |
|--------|----------------------------------|-----------|----------------------------------------------------|
| POST   | /reports/custom                  | Premium   | Generate a custom analytics report for a user      |
| GET    | /reports/:reportId/export        | Wow++     | Export analytics report (tableau format)           |
| POST   | /notify                          | Internal  | Queue a notification for analytics events          |

## Example Usage (Supertest)

```ts
// Example using supertest in analytics.routes.test.ts
request(app)
  .post('/analytics/reports/custom')
  .set('Authorization', 'Bearer ...')
  .send({ tier: 'Premium', foo: 'bar' })
  .expect(201);
Test Coverage
Test file: analytics.routes.test.ts

Scenarios covered:

Successful and unauthorized access to each endpoint

Tier and validation errors

Export and notification logic

Error handling and audit logging

Accessibility
N/A for backend route, but API responses use clear, consistent JSON for client UIs.

Upgrade & Extension Notes
Future: Add more granular report filters or streaming export.

Separate /notify to a dedicated notification route for microservices.

Integrate usage analytics for each API endpoint.

Expand audit logging for regulatory compliance.

Version/Changelog
v1.0.1 (2025-07-17): Initial Crown Certified doc.

LEARNING SECTION
Why this structure?

Clear API contract (methods, endpoints, tier mapping) helps both frontend and backend devs understand and extend features.

Test coverage reference ensures future changes don’t break existing logic.

Upgrade notes help prioritize technical debt and future SaaS monetization.

This is the standard for regulated, production SaaS backends!

Use this format for all API route docs—makes audits, onboarding, and upgrades simple and risk-free!
