
# StorageApiTests.ts – Test Documentation
** Path: docs/backend/tests/StorageApiTests.test.md

**Test File:** `backend/tests/StorageApiTests.ts`  
**Purpose:** Jest/Supertest tests for Storage API endpoints in `storageRoutes.ts` – verifies CRUD, RBAC, and edge cases.

## Features Tested
- GET, POST, PUT, DELETE on `/api/storage/:hostId`
- 404 on missing host/resource
- 400 on invalid input
- 401/403 on auth or role failure (token, expired, wrong role)
- Placeholders: Rate limit, premium file analytics, WOW++ AI audit log

## Test Scenarios
| Scenario                   | Input/Action                | Expected Result                 |
|----------------------------|-----------------------------|---------------------------------|
| Auth fail (no/expired JWT) | GET/POST/PUT/DELETE         | 401/403, error message          |
| CRUD happy path            | Valid token + payload        | 200/201, correct body           |
| Not found                  | Nonexistent host/resource    | 404, error message              |
| Bad input                  | POST bad payload             | 400, error message              |
| Rate limit (placeholder)   | Flood API (when ready)       | 429 or error (if supported)     |

## Tier Enhancements
- **Free:** CRUD endpoints, basic RBAC
- **Premium:** File analytics, multi-tenancy, bulk ops
- **Wow++:** AI auto-scale, audit log verification

## Related Files
- `backend/routes/storage/storageRoutes.ts`
- `@models/storage/Storage`
- `@middleware/authMiddleware`
- `@utils/logger`
- Shared test utils
