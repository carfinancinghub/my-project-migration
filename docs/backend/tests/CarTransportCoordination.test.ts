# CarTransportCoordination.test.ts – Test Documentation

**Test File:** `backend/tests/CarTransportCoordination.test.ts`  
**Purpose:** Unit tests for CarTransportCoordination.tsx, validating logistics, premium features, chat, WebSocket, and AI integrations.

## Features Tested
- Chat history for haulers and buyers
- WebSocket roadside assistance for premium
- AI cost forecast panels and analytics export
- ARIA accessibility for buttons and dialogs
- Robust error handling (API, WebSocket, permissions)
- Tier-based rendering of premium/Wow++ features

## Test Scenarios
| Scenario                | Input/Context                 | Expected Output                          |
|-------------------------|------------------------------|------------------------------------------|
| Chat open/close         | Button click, non-premium     | Chat component visible                   |
| Roadside assistance     | Premium user, mock event      | Alert for assistance rendered            |
| Cost forecast           | Premium, fetch click          | Forecast panel, charts, analytics shown  |
| API failures            | Simulate error                | Logger records, UI shows fallback        |
| ARIA compliance         | RTL/Jest-axe                  | Buttons/dialogs have correct attributes  |

## Tier Enhancements
- **Free:** Chat, basic notifications.
- **Premium:** Real-time roadside, AI cost panel, analytics.
- **Wow++:** Route optimization, PDF/CSV export, full chat audit.

## Related Files
- `frontend/src/components/hauler/CarTransportCoordination.tsx`
- `@utils/logger`, `@lib/websocket`, `@controllers/hauler/HaulerController`
- All mock/test utility files

