// File: SocialShareHelper.js
// Path: C:\CFH\frontend\src\utils\SocialShareHelper.js
// Purpose: Utility for sharing auction data to social platforms with validation, logging, and premium features
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\frontend\src\utils\SocialShareHelper.js to provide social sharing functionality for frontend components.

/*
## Functions Summary

| Function | Purpose | Inputs | Outputs | Dependencies |
|----------|---------|--------|---------|--------------|
| validateShareData | Validates share data | `data: Object` | `true` or throws Error | `@utils/logger` |
| shortenUrl | Shortens URL (mocked) | `url: String` | `Promise<String>` | `@utils/logger` |
| shareToTwitter | Shares to Twitter | `data: Object`, `isPremium: Boolean` | `Promise<Object>` | `@utils/logger` |
| shareToFacebook | Shares to Facebook | `data: Object`, `isPremium: Boolean` | `Promise<Object>` | `@utils/logger` |
| shareToLinkedIn | Shares to LinkedIn | `data: Object`, `isPremium: Boolean` | `Promise<Object>` | `@utils/logger` |
| shareToPlatform | Main share function | `{ data: Object, platform: String, isPremium: Boolean, template: String }` | `Promise<Object>` | `@utils/cacheManager`, `@utils/logger` |
*/

import logger from '@utils/logger';
import { cacheManager } from '@utils/cacheManager';

// Validate share data
const validateShareData = (data) => {
  if (!data || typeof data !== 'object') {
    logger.error('Invalid share data: Not an object');
    throw new Error('Share data must be an object');
  }

  const requiredFields = ['title', 'url'];
  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    logger.error(`Missing required share fields: ${missingFields.join(', ')}`);
    throw new Error(`Missing fields: ${missingFields.join(', ')}`);
  }

  if (!/^https?:\/\//.test(data.url)) {
    logger.error('Invalid share URL format');
    throw new Error('Invalid URL format');
  }

  return true;
};

// Mock URL shortening
const shortenUrl = async (url) => {
  try {
    validateShareData({ url });
    // Mocked shortening service
    const shortUrl = `https://short.link/${url.slice(-8)}`;
    logger.info(`URL shortened: ${url} -> ${shortUrl}`);
    return shortUrl;
  } catch (err) {
    logger.error(`URL shortening failed: ${err.message}`);
    throw new Error(`Cannot shorten URL: ${err.message}`);
  }
};

// Share to Twitter
const shareToTwitter = async (data, isPremium = false) => {
  try {
    validateShareData(data);
    const shortUrl = await shortenUrl(data.url);
    const message = isPremium && data.template ? data.template.replace('{title}', data.title).replace('{url}', shortUrl) : `Check out ${data.title}: ${shortUrl}`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(shareUrl, '_blank');
    logger.info(`Shared to Twitter: ${message}`);
    return { success: true, platform: 'twitter', shareUrl };
  } catch (err) {
    logger.error(`Twitter share failed: ${err.message}`);
    throw new Error(`Failed to share to Twitter: ${err.message}`);
  }
};

// Share to Facebook
const shareToFacebook = async (data, isPremium = false) => {
  try {
    validateShareData(data);
    const shortUrl = await shortenUrl(data.url);
    const message = isPremium && data.template ? data.template.replace('{title}', data.title).replace('{url}', shortUrl) : data.title;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}&quote=${encodeURIComponent(message)}`;
    window.open(shareUrl, '_blank');
    logger.info(`Shared to Facebook: ${message}`);
    return { success: true, platform: 'facebook', shareUrl };
  } catch (err) {
    logger.error(`Facebook share failed: ${err.message}`);
    throw new Error(`Failed to share to Facebook: ${err.message}`);
  }
};

// Share to LinkedIn
const shareToLinkedIn = async (data, isPremium = false) => {
  try {
    validateShareData(data);
    const shortUrl = await shortenUrl(data.url);
    const message = isPremium && data.template ? data.template.replace('{title}', data.title).replace('{url}', shortUrl) : data.title;
    const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shortUrl)}&title=${encodeURIComponent(message)}`;
    window.open(shareUrl, '_blank');
    logger.info(`Shared to LinkedIn: ${message}`);
    return { success: true, platform: 'linkedin', shareUrl };
  } catch (err) {
    logger.error(`LinkedIn share failed: ${err.message}`);
    throw new Error(`Failed to share to LinkedIn: ${err.message}`);
  }
};

// Main share function
const shareToPlatform = async ({ data, platform = 'twitter', isPremium = false, template = null }) => {
  try {
    validateShareData(data);

    // Save user preferences
    if (isPremium) {
      cacheManager.set(`share_prefs_${data.userId || 'guest'}`, { platform }, { ttl: 86400 });
    }

    switch (platform.toLowerCase()) {
      case 'twitter':
        return await shareToTwitter(data, isPremium);
      case 'facebook':
        return await shareToFacebook(data, isPremium);
      case 'linkedin':
        return await shareToLinkedIn(data, isPremium);
      default:
        logger.error(`Unsupported platform: ${platform}`);
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (err) {
    logger.error(`Share failed: ${err.message}`);
    throw err;
  }
};

export { shareToPlatform, validateShareData };