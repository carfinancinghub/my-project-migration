<!--
File: UserProfileFeatureList.md
Path: C:\CFH\docs\features\UserProfileFeatureList.md
Purpose: Define features for User Profile module
Author: CFH Dev Team
Date: June 17, 2025, 18:16:05 PDT
Cod2 Crown Certified: Yes
Save Location: C:\CFH\docs\features\UserProfileFeatureList.md
Batch ID: UserProfile-061725
-->
User Profile Feature List
Purpose
Define features for the User Profile module, including PointsHistory.jsx and UserProfilePage.jsx, to enhance user engagement and track subscription revenue within the CFH Automotive Ecosystem.
Features
PointsHistory.jsx

Display Points: Show total points and transaction history (e.g., bids, purchases, referrals).
Real-Time Updates: Fetch data via analytics.routes.ts for live point updates.
Multi-Language Support: Integrate with i18n.ts for English, Spanish, French.
Visual Components:
Table listing point transactions (date, action, points).
Chart visualizing point trends over time.
Export button for CSV download.


Accessibility: ARIA labels, keyboard navigation.
SG Man Compliance:
Crown Certified headers (Author, Date, Purpose, Save Location, Batch ID: UserProfile-061725).
propTypes for React component.
~95% test coverage via PointsHistory.test.jsx.



UserProfilePage.jsx

User Details: Display username, email, subscription status.
Subscription Metrics: Show current plan, payment history, and revenue contribution.
Points Integration: Embed PointsHistory.jsx for points summary.
Edit Profile: Allow updates to username, email, and preferences with validation.
Multi-Language Support: Integrate with i18n.ts for English, Spanish, French.
Visual Components:
Profile card with user details.
Subscription table for payment history.
Edit form with save/cancel buttons.


Accessibility: ARIA labels, keyboard navigation.
SG Man Compliance:
Crown Certified headers (Author, Date, Purpose, Save Location, Batch ID: UserProfile-061725).
propTypes for React component.
~95% test coverage via UserProfilePage.test.jsx.



Inputs

PointsHistory.jsx:
User ID from UserAuth.js.
Point data from analyticsApi.ts.
Language preference from i18n.ts.


UserProfilePage.jsx:
User data (username, email, subscription) from analyticsApi.ts.
User ID from UserAuth.js.
Language preference from i18n.ts.



Outputs

PointsHistory.jsx:
Rendered points table and chart.
Exported CSV file of point history.


UserProfilePage.jsx:
Rendered profile card, subscription table, and edit form.
Updated user data on save.



Dependencies

analytics.routes.ts (C:\CFH\CFH_Analytics)
analyticsApi.ts (C:\CFH\frontend\src\services)
UserAuth.js (C:\CFH\frontend\src\utils)
CurrencyConverterWidget.jsx (C:\CFH\frontend\src\components\common)
PointsHistory.jsx (C:\CFH\frontend\src\components\user)
i18n.ts (C:\CFH\frontend\src\i18n)

Compliance

Save to C:\CFH\frontend\src\components\user.
Sync to Google Drive (https://drive.google.com/drive/folders/1-0kXjlGMx2RAys8in-ise5imXkQywdwO).
Verify via SG Man Compliance Review Tab.


