SocialShareHelper Functions Documentation
Date: 2025-05-27 | Batch: Share-052725
Crown Certified Documentation

File: SocialShareHelper-functions.md
Path: C:\CFH\docs\functions\utils\SocialShareHelper-functions.md
Purpose: Detailed documentation of SocialShareHelper.js functions.
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


generateHashtags
Generates hashtags
data: Object
String
None


shareToTwitter
Shares to Twitter
data: Object, isPremium: Boolean, template: String
Promise<Object>
@utils/logger


shareToFacebook
Shares to Facebook
data: Object, isPremium: Boolean, template: String
Promise<Object>
@utils/logger


shareToLinkedIn
Shares to LinkedIn
data: Object, isPremium: Boolean, template: String
Promise<Object>
@utils/logger


shareToPlatform
Main share function
{ data: Object, platform: String, isPremium: Boolean, template: String }
Promise<Object>
@utils/cacheManager, @utils/logger


trackAnalytics
Tracks share analytics
shareUrl: String
Promise<Object>
@utils/logger


Error Handling

Validates required fields and URL format.
Logs errors with logger.error.
Throws descriptive errors.

SG Man Compliance

Crown Certified Header: Included.
Test Coverage: Validated via SocialShareHelper.test.js.

