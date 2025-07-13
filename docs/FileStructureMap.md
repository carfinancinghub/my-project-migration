
© 2025 CFH, All Rights Reserved.Purpose: Document the file structure, alias mappings, and quality standards for the CFH Automotive Ecosystem.Author: CFH Dev TeamDate: 061925 [0037]Save Location: C:\CFH\docs\FileStructureMap.md
CFH Automotive Ecosystem File Structure Map
Purpose
Define the directory structure, alias mappings, and quality standards to ensure consistency and compliance across the CFH Automotive Ecosystem.
Directory Structure

Frontend Source Code:
C:\CFH\frontend\src\components\<module>: Module-specific components (e.g., user, common).
Example: C:\CFH\frontend\src\components\user\UserProfilePage.jsx


C:\CFH\frontend\src\utils: Utility functions and hooks.
Example: C:\CFH\frontend\src\utils\UserAuth.js


C:\CFH\frontend\src\services: API service files.
Example: C:\CFH\frontend\src\services\analyticsApi.ts




Frontend Tests:
C:\CFH\frontend\src\tests\<module>: Module-specific test files.
Example: C:\CFH\frontend\src\tests\user\UserProfilePage.test.jsx


C:\CFH\frontend\src\tests\common: Tests for shared components.
Example: C:\CFH\frontend\src\tests\common\ErrorBoundary.test.jsx




Documentation:
C:\CFH\docs\features: Frontend feature definitions.
Example: C:\CFH\docs\features\UserProfileFeatureList.md


C:\CFH\docs\backend: Backend-specific documentation.
Example: C:\CFH\docs\backend\constants.md


C:\CFH\docs\functions\components: Component function documentation.
Example: C:\CFH\docs\functions\components\MarketplaceInsightsDashboard.functions.md


C:\CFH\docs: General documentation.
Example: C:\CFH\docs\FileStructureMap.md




Backend:
C:\CFH\backend\routes\<module>: Module-specific API routes.
Example: C:\CFH\backend\routes\user\userProfileRoutes.js


C:\CFH\backend\tests\<module>: Module-specific backend tests.
Example: C:\CFH\backend\tests\routes\user\userProfileRoutes.test.js





Alias Mappings

@components/<module>: C:\CFH\frontend\src\components\<module> (e.g., @components/user/UserProfilePage).
@services/: C:\CFH\frontend\src\services (e.g., @services/analyticsApi).
@utils/: C:\CFH\frontend\src\utils (e.g., @utils/logger).
@routes/<module>: C:\CFH\backend\routes\<module> (e.g., @routes/user/userProfileRoutes).

Quality Standards

Naming Conventions:
camelCase for functions, variables, and filenames in utils, hooks, services.
PascalCase for React components.
Suffixes: .test.tsx (TypeScript tests), .test.jsx (legacy JavaScript tests), .routes.ts (backend routes, .js for legacy), .functions.md (component docs), FeatureList.md (feature specs).


Metadata:
Headers: © 2025 CFH, All Rights Reserved, Purpose, Author, Date: MMDDYY [HHMM], Save Location.
Components add: Version, Crown Certified: Yes/No.


Testing:
~95% coverage for .test.tsx/.test.js.
Jest with jest-axe for ARIA compliance, retry logic tests, mocked services.


Automation:
Enforce .ts/.tsx for frontend/new backend; .js for legacy backend routes.
ESLint with .eslintrc.cfh.json in C:\CFH\frontend\.
@services/api.ts calls include JWT token and X-Correlation-ID in tests.



Compliance

Sync to Google Drive: https://drive.google.com/drive/folders/1-0kXjlGMx2RAys8in-ise5imXkQywdwO?usp=drive_link.
Verify via SG Man Compliance Review Tab.


- C:\CFH\backend\routes\arbitrator\arbitrators.js
- C:\CFH\backend\routes\onboarding\onboarding.js
