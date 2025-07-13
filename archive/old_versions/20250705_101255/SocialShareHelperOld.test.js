// File: SocialShareHelper.test.js
// Path: C:\CFH\frontend\src\tests\utils\SocialShareHelper.test.js
// Purpose: Unit tests for SocialShareHelper.js, covering social sharing, validation, and premium features
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\frontend\src\tests\utils\SocialShareHelper.test.js to test the SocialShareHelper.js utility.

import { shareToPlatform, validateShareData } from '@utils/SocialShareHelper';
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

  it('shares to Twitter with premium template', async () => {
    const result = await shareToPlatform({
      data: mockData,
      platform: 'twitter',
      isPremium: true,
      template: 'Join {title} at {url}',
    });
    expect(result.success).toBe(true);
    expect(result.platform).toBe('twitter');
    expect(mockWindowOpen).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Shared to Twitter'));
  });

  it('shares to Facebook for freemium user', async () => {
    const result = await shareToPlatform({ data: mockData, platform: 'facebook' });
    expect(result.success).toBe(true);
    expect(result.platform).toBe('facebook');
    expect(mockWindowOpen).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Shared to Facebook'));
  });

  it('shares to LinkedIn with preferences saved', async () => {
    const result = await shareToPlatform({ data: mockData, platform: 'linkedin', isPremium: true });
    expect(result.success).toBe(true);
    expect(result.platform).toBe('linkedin');
    expect(mockWindowOpen).toHaveBeenCalled();
    expect(cacheManager.set).toHaveBeenCalledWith('share_prefs_123', { platform: 'linkedin' }, { ttl: 86400 });
  });

  it('throws error for unsupported platform', async () => {
    await expect(shareToPlatform({ data: mockData, platform: 'invalid' })).rejects.toThrow('Unsupported platform: invalid');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Unsupported platform'));
  });

  it('handles undefined data gracefully', async () => {
    await expect(shareToPlatform({ data: null, platform: 'twitter' })).rejects.toThrow('Share data must be an object');
    expect(logger.error).toHaveBeenCalled();
  });
});

SocialShareHelper.test.propTypes = {};