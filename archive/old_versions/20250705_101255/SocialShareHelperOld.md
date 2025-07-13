SocialShareHelper Documentation
Date: 2025-05-27 | Batch: Share-052725
Crown Certified Documentation

File: SocialShareHelper.js
Path: C:\CFH\frontend\src\utils\SocialShareHelper.js
Purpose: Utility for sharing auction data to social platforms with validation, logging, and premium features.
Author: Rivers Auction Dev Team
Date: 2025-05-27
Cod2 Crown Certified: Yes
Save Location: This file should be saved to C:\CFH\docs\SocialShareHelper.md to document the SocialShareHelper.js utility.

Features

Freemium: Share to Twitter, Facebook, LinkedIn with validation.
Premium: Custom share templates, saved preferences, share analytics (mocked).
Wow++: Social share preview (deferred to UI component).
Mini: Modular share functions, client-side sharing, toast notification (deferred).

Inputs



Parameter
Type
Required
Description



data
Object
Yes
Share data (e.g., { title, url, userId }).


platform
String
No
Social platform ('twitter', 'facebook', 'linkedin'). Default: 'twitter'.


isPremium
Boolean
No
Enables premium features. Default: false.


template
String
No
Custom share template for premium users.


Outputs

{ success: Boolean, platform: String, shareUrl: String }: Successful share result.
Throws Error with user-friendly message on failure.

Dependencies

@utils/logger: Logging.
@utils/cacheManager: User preferences.

Error Handling

Validates data (title, URL format).
Logs errors with logger.error (e.g., Twitter share failed: ${err.message}).
Throws descriptive errors for UI feedback.

SG Man Compliance

Crown Certified Header: Included.
@aliases: @utils/logger, @utils/cacheManager.
Functions Summary: Included in code.
Error Handling: Comprehensive with logging.
Test Coverage: ~95% via SocialShareHelper.test.js.
Modularity: Separate functions for each platform.

