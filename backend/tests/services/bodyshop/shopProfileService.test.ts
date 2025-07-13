/*
File: shopProfileService.test.ts
Path: C:\CFH\backend\tests\services\bodyshop\shopProfileService.test.ts
Created: 2025-07-04 12:10 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for shopProfileService with tiered features and performance checks.
Artifact ID: y9z0a1b2-c3d4-e5f6-g7h8-i9j0k1l2m3n4
Version ID: z0a1b2c3-d4e5-f6g7-h8i9-j0k1l2m3n4o5
*/

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import logger from '@/utils/logger';
import {
    shopProfileService,
    ShopProfileServiceError,
    UnauthorizedShopAccessError,
    ShopClaimConflictError
} from '@/backend/services/bodyshop/shopProfileService';

// Mock the logger to prevent console output during tests and spy on calls
jest.mock('@/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));

// Mock internal dependencies if they were real (e.g., ShopRepository, ReviewRepository, aiBodyShopMatchingService, notificationService)
// For now, the service uses mock data internally, so we test its public interface directly.

describe('shopProfileService', () => {
    let service: typeof shopProfileService;

    beforeEach(() => {
        service = new (shopProfileService as any).constructor(); // Create a new instance for each test
        jest.clearAllMocks();
        // Mock setTimeout to run immediately for performance checks
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });

    afterEach(() => {
        (global.setTimeout as jest.Mock).mockRestore();
        (global.clearTimeout as jest.Mock).mockRestore();
    });

    // --- Free Tier Tests ---
    describe('Free Tier Methods', () => {
        const freeUser = 'freeUser123';
        const shopId = 'shopFree1';
        const basicUpdates = { name: 'New Shop Name', phone: '555-1234' };

        it('searchShops returns basic shops successfully', async () => {
            const result = await service.searchShops({});
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty('name');
            expect(result[0]).not.toHaveProperty('certifications'); // Free tier specificity
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Searching shops with query'));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('searchShops throws ShopProfileServiceError on failure', async () => {
            const originalSearchShops = service.searchShops;
            service.searchShops = jest.fn().mockImplementationOnce(() => { throw new Error('DB error'); });
            await expect(service.searchShops({})).rejects.toThrow(ShopProfileServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to search shops'), expect.any(Error));
            service.searchShops = originalSearchShops;
        });

        it('getShopProfile returns basic profile successfully', async () => {
            const result = await service.getShopProfile(shopId);
            expect(result.id).toBe(shopId);
            expect(result).toHaveProperty('name');
            expect(result).not.toHaveProperty('virtualTourUrl'); // Free tier specificity
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Fetching basic profile for shop: ${shopId}`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('getShopProfile throws ShopProfileServiceError if profile not found', async () => {
            const originalGetShopProfile = service.getShopProfile;
            service.getShopProfile = jest.fn().mockImplementationOnce(() => { throw new Error('Shop profile not found.'); }); // Simulate not found
            await expect(service.getShopProfile('nonExistentShop')).rejects.toThrow(ShopProfileServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to get profile for shop nonExistentShop'), expect.any(Error));
            service.getShopProfile = originalGetShopProfile;
        });

        it('updateBasicProfile updates profile successfully for authorized user', async () => {
            const updatedProfile = await service.updateBasicProfile(shopId, freeUser, basicUpdates);
            expect(updatedProfile.id).toBe(shopId);
            expect(updatedProfile.name).toBe(basicUpdates.name);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Updating basic profile for shop ${shopId} by user: ${freeUser}`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('updateBasicProfile throws ShopProfileServiceError on unauthorized update', async () => {
            const originalUpdateBasicProfile = service.updateBasicProfile;
            service.updateBasicProfile = jest.fn().mockImplementationOnce(() => { throw new Error('Unauthorized update'); });
            await expect(service.updateBasicProfile(shopId, 'unauthorizedUser', basicUpdates)).rejects.toThrow(ShopProfileServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to update basic profile for shop'), expect.any(Error));
            service.updateBasicProfile = originalUpdateBasicProfile;
        });
    });

    // --- Standard Tier Tests ---
    describe('Standard Tier Methods', () => {
        const standardUser = 'standardUser1';
        const shopId = 'shopStandard1';
        const reviewData = { rating: 5, reviewText: 'Excellent service!', reviewerId: standardUser };

        it('addReview adds review successfully', async () => {
            const result = await service.addReview(shopId, standardUser, reviewData);
            expect(result.id).toBeDefined();
            expect(result.rating).toBe(reviewData.rating);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`User ${standardUser} adding review to shop ${shopId}`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('addReview throws ShopProfileServiceError on failure', async () => {
            const originalAddReview = service.addReview;
            service.addReview = jest.fn().mockImplementationOnce(() => { throw new Error('Review DB error'); });
            await expect(service.addReview(shopId, standardUser, reviewData)).rejects.toThrow(ShopProfileServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to add review to shop'), expect.any(Error));
            service.addReview = originalAddReview;
        });

        it('enhancedSearchShops returns enhanced shops successfully', async () => {
            const result = await service.enhancedSearchShops({ serviceType: 'Collision' });
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty('priceRange'); // Standard tier specificity
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Performing enhanced search with query'));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('enhancedSearchShops throws ShopProfileServiceError on failure', async () => {
            const originalEnhancedSearchShops = service.enhancedSearchShops;
            service.enhancedSearchShops = jest.fn().mockImplementationOnce(() => { throw new Error('Search API error'); });
            await expect(service.enhancedSearchShops({})).rejects.toThrow(ShopProfileServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to perform enhanced search'), expect.any(Error));
            service.enhancedSearchShops = originalEnhancedSearchShops;
        });
    });

    // --- Premium Tier Tests ---
    describe('Premium Tier Methods', () => {
        const premiumUser = 'premiumUser1';
        const shopId = 'shopPremium1';
        const premiumUpdates = { photos: ['url_new'], certifications: ['ASE'] };

        it('updatePremiumFeatures updates successfully for authorized user', async () => {
            const updatedProfile = await service.updatePremiumFeatures(shopId, premiumUser, premiumUpdates);
            expect(updatedProfile.id).toBe(shopId);
            expect(updatedProfile.photos?.[0]).toBe('url_new');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Updating premium features for shop ${shopId} by user: ${premiumUser}`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('updatePremiumFeatures throws ShopProfileServiceError on unauthorized update', async () => {
            const originalUpdatePremiumFeatures = service.updatePremiumFeatures;
            service.updatePremiumFeatures = jest.fn().mockImplementationOnce(() => { throw new Error('Unauthorized premium update'); });
            await expect(service.updatePremiumFeatures(shopId, 'unauthorized', premiumUpdates)).rejects.toThrow(ShopProfileServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to update premium features'), expect.any(Error));
            service.updatePremiumFeatures = originalUpdatePremiumFeatures;
        });

        it('getShopAnalytics returns analytics successfully', async () => {
            const result = await service.getShopAnalytics(shopId, premiumUser);
            expect(result.shopId).toBe(shopId);
            expect(result).toHaveProperty('revenueTrend');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Fetching analytics for shop ${shopId} by user: ${premiumUser}`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('getShopAnalytics throws ShopProfileServiceError on failure', async () => {
            const originalGetShopAnalytics = service.getShopAnalytics;
            service.getShopAnalytics = jest.fn().mockImplementationOnce(() => { throw new Error('Analytics service error'); });
            await expect(service.getShopAnalytics(shopId, premiumUser)).rejects.toThrow(ShopProfileServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to get analytics for shop'), expect.any(Error));
            service.getShopAnalytics = originalGetShopAnalytics;
        });
    });

    // --- Wow++ Tier Tests ---
    describe('Wow++ Tier Methods', () => {
        const wowPlusUser = 'wowPlusUser1';
        const shopId = 'shopWowPlus1';
        const claimData = { shopId, ownerName: 'John Doe', ownerEmail: 'john@example.com', proofOfOwnershipUrl: 'http://proof.com/doc.pdf' };
        const certificationData = { certificationType: 'I-CAR Gold', applicationData: { documents: ['doc_url'] } };
        const availabilityData = { isAvailable: true, nextAvailableTime: '2025-07-04T15:00:00Z' };

        it('claimShopListing claims successfully', async () => {
            const result = await service.claimShopListing(wowPlusUser, claimData);
            expect(result.claimId).toBeDefined();
            expect(result.status).toBe('Pending Verification');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`User ${wowPlusUser} attempting to claim shop listing ${shopId}`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('claimShopListing throws ShopClaimConflictError if already claimed', async () => {
            const originalClaimShopListing = service.claimShopListing;
            service.claimShopListing = jest.fn().mockImplementationOnce(() => { throw new ShopClaimConflictError('Listing already claimed.', shopId); });
            await expect(service.claimShopListing(wowPlusUser, claimData)).rejects.toThrow(ShopClaimConflictError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to claim shop listing'), expect.any(ShopClaimConflictError));
            service.claimShopListing = originalClaimShopListing;
        });

        it('applyForCertification applies successfully', async () => {
            const result = await service.applyForCertification(shopId, wowPlusUser, certificationData);
            expect(result.applicationId).toBeDefined();
            expect(result.status).toBe('Submitted');
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`User ${wowPlusUser} applying for certification for shop ${shopId}`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('applyForCertification throws ShopProfileServiceError on failure', async () => {
            const originalApplyForCertification = service.applyForCertification;
            service.applyForCertification = jest.fn().mockImplementationOnce(() => { throw new Error('Payment failed'); });
            await expect(service.applyForCertification(shopId, wowPlusUser, certificationData)).rejects.toThrow(ShopProfileServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to apply for certification for shop'), expect.any(Error));
            service.applyForCertification = originalApplyForCertification;
        });

        it('updateAvailability updates successfully', async () => {
            await service.updateAvailability(shopId, wowPlusUser, availabilityData);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`User ${wowPlusUser} updating availability for shop ${shopId} to true`));
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('updateAvailability throws ShopProfileServiceError on failure', async () => {
            const originalUpdateAvailability = service.updateAvailability;
            service.updateAvailability = jest.fn().mockImplementationOnce(() => { throw new Error('DB write error'); });
            await expect(service.updateAvailability(shopId, wowPlusUser, availabilityData)).rejects.toThrow(ShopProfileServiceError);
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to update availability for shop'), expect.any(Error));
            service.updateAvailability = originalUpdateAvailability;
        });
    });

    // --- Performance (CQS) Scenarios ---
    it('should log a warning if searchShops response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => { setTimeout(() => cb(), 600); return {} as any; });
        await service.searchShops({});
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Search shops response time exceeded 500ms'));
    });

    it('should log a warning if getShopProfile response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => { setTimeout(() => cb(), 600); return {} as any; });
        await service.getShopProfile('shopSlow');
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Get shop profile response time exceeded 500ms'));
    });

    it('should log a warning if updateBasicProfile response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => { setTimeout(() => cb(), 600); return {} as any; });
        await service.updateBasicProfile('shopSlow', 'userSlow', { name: 'Slow Shop' });
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Update basic profile response time exceeded 500ms'));
    });

    it('should log a warning if addReview response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => { setTimeout(() => cb(), 600); return {} as any; });
        await service.addReview('shopSlow', 'userReviewer', { rating: 4, reviewText: 'Slow review' });
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Add review response time exceeded 500ms'));
    });

    it('should log a warning if enhancedSearchShops response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => { setTimeout(() => cb(), 600); return {} as any; });
        await service.enhancedSearchShops({});
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Enhanced search response time exceeded 500ms'));
    });

    it('should log a warning if updatePremiumFeatures response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => { setTimeout(() => cb(), 600); return {} as any; });
        await service.updatePremiumFeatures('shopSlow', 'userPremium', {});
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Update premium features response time exceeded 500ms'));
    });

    it('should log a warning if getShopAnalytics response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => { setTimeout(() => cb(), 600); return {} as any; });
        await service.getShopAnalytics('shopSlow', 'userPremium');
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Get shop analytics response time exceeded 500ms'));
    });

    it('should log a warning if claimShopListing response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => { setTimeout(() => cb(), 600); return {} as any; });
        await service.claimShopListing('userWow', { shopId: 'shopClaim', ownerName: 'Owner', ownerEmail: 'owner@example.com', proofOfOwnershipUrl: 'http://proof.com' });
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Claim listing response time exceeded 500ms'));
    });

    it('should log a warning if applyForCertification response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => { setTimeout(() => cb(), 600); return {} as any; });
        await service.applyForCertification('shopCert', 'userWow', { certificationType: 'Test', applicationData: {} });
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Certification application response time exceeded 500ms'));
    });

    it('should log a warning if updateAvailability response time exceeds 500ms', async () => {
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => { setTimeout(() => cb(), 600); return {} as any; });
        await service.updateAvailability('shopAvail', 'userWow', { isAvailable: true });
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Update availability response time exceeded 500ms'));
    });
});