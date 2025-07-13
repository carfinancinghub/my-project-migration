// File: SocialShareHelper.test.js
// Path: C:\CFH\frontend\src\tests\utils\SocialShareHelper.test.js
// Purpose: Unit tests for SocialShareHelper.js, covering social sharing, validation, hashtags, and analytics
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\frontend\src\tests\utils\SocialShareHelper.test.js to test the SocialShareHelper.js utility.

import { shareToPlatform, validateShareData, generateHashtags, trackAnalytics } from '@utils/SocialShareHelper';
import logger from '@utils/logger';
import { cacheManager } from '@utils/cacheManager';

jest.mock('@utils/logger');
jest.mock('@utils/cacheManager');

describe('SocialShareHelper', () => {
  let mockWindowOpen;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWindowOpen = jest.fn();
    global.window.open = mockWindowOpen;
    cacheManager.set.mockReturnValue(true);
  });

  const mockData = {
    title: 'Test Auction',
    url: 'https://example.com/auction',
    userId: '123',
    itemType: 'Car',
  };

  it('validates share data successfully', () => {
    expect(() => validateShareData(mockData)).not.toThrow();
    expect(validateShareData(mockData)).toBe(true);
  });

  it('throws error for invalid share data', () => {
    expect(() => validateShareData({})).toThrow('Missing fields: title, url');
    expect(() => validateShareData({ title: 'Test', url: 'invalid' })).toThrow('Invalid URL format');
    expect(logger.error).toHaveBeenCalled();
  });

  it('generates relevant hashtags', () => {
    const hashtags = generateHashtags(mockData);
    expect(hashtags).toBe('#RiversAuction #Auction #Car');
  });

  it('shares to Twitter with premium template and analytics', async () => {
    const result = await shareToPlatform({
      data: mockData,
      platform: 'twitter',
      isPremium: true,
      template: 'Join {title} at {url}',
    });
    expect(result.success).toBe(true);
    expect(result.platform).toBe('twitter');
    expect(mockWindowOpen).toHaveBeenCalled();
    expect(result.analytics.clicks).toBe(0);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Shared to Twitter'));
    expect(cacheManager.set).toHaveBeenCalled();
  });

  it('shares to Facebook for freemium user', async () => {
    const result = await shareToPlatform({ data: mockData, platform: 'facebook' });
    expect(result.success).toBe(true);
    expect(result.platform).toBe('facebook');
    expect(mockWindowOpen).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Shared to Facebook'));
  });

  it('shares to LinkedIn with hashtags', async () => {
    const result = await shareToPlatform({ data: mockData, platform: 'linkedin' });
    expect(result.success).toBe(true);
    expect(result.platform).toBe('linkedin');
    expect(mockWindowOpen).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Shared to LinkedIn'));
  });

  it('tracks analytics for share', async () => {
    const analytics = await trackAnalytics('https://twitter.com/share');
    expect(analytics.clicks).toBe(0);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Analytics tracked'));
  });

  it('throws error for unsupported platform', async () => {
    await expect(shareToPlatform({ data: mockData, platform: 'invalid' })).rejects.toThrow('Unsupported platform: invalid');
    expect(logger.error).toHaveBeenCalled();
  });

  it('handles undefined data gracefully', async () => {
    await expect(shareToPlatform({ data: null, platform: 'twitter' })).rejects.toThrow('Share data must be an object');
    expect(logger.error).toHaveBeenCalled();
  });
});

SocialShareHelper.test.propTypes = {};