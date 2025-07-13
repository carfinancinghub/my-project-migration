<!--
File: constants.md
Path: C:\CFH\docs\backend\constants.md
Purpose: Documents shared constants and enums defined in utils/constants.ts for the backend.
Author: CFH Dev Team
Date: June 17, 2025, 18:12:00 PDT
Cod2 Crown Certified: Yes
Save Location: C:\CFH\docs\backend\constants.md
Batch ID: UserProfile-061725
-->

© 2025 CFH, All Rights Reserved.
Purpose: Document shared constants and enums defined in utils/constants.ts for the backend.
Author: CFH Dev TeamDate: 061825 [1848]
Save Location: C:\CFH\docs\backend\constants.md

CFH Shared Backend Constants
File: utils/constants.tsLocation: C:\CFH\backend\utils\constants.ts
Author: CFH Dev TeamDate: 061725 [1812]
Status: ✅ Crown Certified
Test Requirement: ❌ No unit test needed (pure enum definitions)

🔄 Enums Defined
TransactionStatus
Represents the lifecycle status of a financial transaction.



Key
Description



PENDING
Awaiting action


FUNDS_HELD
Payment secured in escrow


RELEASED
Funds released to recipient


DISPUTED
Payment under review


CANCELLED
Transaction has been voided



UserRole
Represents authorized user types in the CFH ecosystem.



Key
Description



BUYER
Vehicle purchaser


SELLER
Vehicle provider


AGENT
Authorized intermediary



Tier
Defines access levels and feature entitlements.



Key
Description



FREE
Basic public access


STANDARD
Registered user with limited features


PREMIUM
Full access with premium support


WOW_PLUS_PLUS
All features including experimental



📌 Notes

These constants are imported across backend modules for type-safe comparisons.
Do not modify values without ecosystem-wide impact analysis.


