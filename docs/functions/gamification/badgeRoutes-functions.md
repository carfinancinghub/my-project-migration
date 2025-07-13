# Function Summary: badgeRoutes.js

**File**: badgeRoutes.js  
**Path**: C:\CFH\backend\routes\gamification\badgeRoutes.js  
**Purpose**: Provides gamification endpoints for badge listing, purchases, and user achievement tracking.

---

### 1. GET /badges
- **Purpose**: Fetch list of all available badges
- **Inputs**: None
- **Outputs**: JSON with array of badge objects
- **Dependencies**: `badgeService.getAvailableBadges()`

### 2. POST /badges/purchase
- **Purpose**: Process a badge purchase using escrow
- **Inputs**: `userId`, `badgeId` from request body
- **Outputs**: JSON confirmation of purchase
- **Dependencies**: `escrowService.processBadgePurchase(userId, badgeId)`

### 3. GET /achievements/:userId
- **Purpose**: Retrieve a user's earned achievements
- **Inputs**: `userId` as route param
- **Outputs**: JSON array of achievements
- **Dependencies**: `badgeService.getUserAchievements(userId)`

---

### Error Handling
All routes use `logger.error()` for server-side logging and respond with HTTP 500 on failures.

---

**Author**: Rivers Auction Dev Team  
**Date**: 2025-05-20  
**Cod2 Crown Certified**: Yes
