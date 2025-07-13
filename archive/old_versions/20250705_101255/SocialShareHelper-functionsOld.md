SocialShareHelper Functions Documentation
Date: 2025-05-27 | Batch: Share-052725
Crown Certified Documentation

File: SocialShareHelper-functions.md
Path: C:\CFH\docs\functions\utils\SocialShareHelper-functions.md
Purpose: Detailed documentation of SocialShareHelper.js functions, including inputs, outputs, and dependencies.
Author: Rivers Auction Dev Team
Date: 2025-05-27
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\functions\utils\SocialShareHelper-functions.md to document the functions of SocialShareHelper.js.

Functions



Function
Purpose
Inputs
Outputs
Dependencies



validateShareData
Validates share data
data: Object
true or throws Error
@utils/logger


shortenUrl
Shortens URL (mocked)
url: String
Promise<String>
@utils/logger


shareToTwitter
Shares to Twitter
data: Object, isPremium: Boolean
Promise<Object>
@utils/logger


shareToFacebook
Shares to Facebook
data: Object, isPremium: Boolean
Promise<Object>
@utils/logger


shareToLinkedIn
Shares to LinkedIn
data: Object, isPremium: Boolean
Promise<Object>
@utils/logger


shareToPlatform
Main share function
{ data: Object, platform: String, isPremium: Boolean, template: String }
Promise<Object>
@utils/cacheManager, @utils/logger


Error Handling

Validates required fields and URL format.
Logs errors with logger.error.
Throws descriptive errors for UI feedback.

SG Man Compliance

Crown Certified Header: Included.
Test Coverage: Validated via SocialShareHelper.test.js.

