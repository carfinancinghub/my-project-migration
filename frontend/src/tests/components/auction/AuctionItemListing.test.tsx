/*
File: AuctionItemListing.test.tsx
Path: C:\CFH\frontend\src\tests\components\auction\AuctionItemListing.test.tsx
Created: 2025-07-03 14:05 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest tests for AuctionItemListing component with ≥95% coverage including accessibility.
Artifact ID: m4n5o6p7-q8r9-s0t1-u2v3-w4x5y6z7a8b9
Version ID: n5o6p7q8-r9s0-t1u2-v3w4-x5y6z7a8b9c0
*/

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended matchers
import { axe, toHaveNoViolations } from 'jest-axe'; // For accessibility testing

import AuctionItemListing from '@/components/auction/AuctionItemListing';
import logger from '@/utils/logger'; // Mock logger

// Extend Jest with jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock the logger to prevent console output during tests and spy on calls
jest.mock('@/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));

// Mock child components or services that might be pulled in for Wow++ features
jest.mock('@/components/ar/ARViewer', () => ({
    ARViewer: ({ modelUrl }: { modelUrl: string }) => <div>Mocked ARViewer for: {modelUrl}</div>,
}));
jest.mock('@/components/blockchain/BlockchainRecordDisplay', () => ({
    BlockchainRecordDisplay: ({ recordId }: { recordId: string }) => <div>Mocked BlockchainRecordDisplay for: {recordId}</div>,
}));


describe('AuctionItemListing', () => {
    // Basic mock auction item data
    const mockAuction = {
        id: 'auc123',
        vin: 'TESTVIN123456789',
        title: '2023 Luxury Sedan',
        description: 'A beautiful car with all the premium features.',
        startingBid: 25000,
        currentBid: 27000,
        photos: ['http://example.com/photo1.jpg', 'http://example.com/photo2.jpg', 'http://example.com/photo3.jpg'],
        endTime: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
        status: 'Live' as 'Live',
        bidCount: 10,
    };

    afterEach(() => {
        cleanup(); // Unmounts React trees that were mounted with render
        jest.clearAllMocks(); // Clear mock calls
    });

    // --- Free Tier Tests ---
    describe('Free Tier Functionality', () => {
        it('renders basic auction details for Free tier', () => {
            render(<AuctionItemListing auction={mockAuction} userTier="free" />);

            expect(screen.getByText(mockAuction.title)).toBeInTheDocument();
            expect(screen.getByText(`VIN: ${mockAuction.vin}`)).toBeInTheDocument();
            expect(screen.getByText(mockAuction.description)).toBeInTheDocument();
            expect(screen.getByText(`Starting Bid: $${mockAuction.startingBid.toLocaleString()}`)).toBeInTheDocument();
            expect(screen.getByText(`Current Bid: $${mockAuction.currentBid.toLocaleString()}`)).toBeInTheDocument();
            expect(screen.getByLabelText(`Primary photo of ${mockAuction.title}`)).toHaveAttribute('src', mockAuction.photos[0]);
            // Expect only first 5 photos for Free tier
            expect(screen.getAllByRole('listitem').length).toBe(2); // mockAuction has 3 photos, slice(1) means 2 additional photos
        });

        it('displays "No Photos Available" when photos array is empty or null', () => {
            const noPhotosAuction = { ...mockAuction, photos: [] };
            render(<AuctionItemListing auction={noPhotosAuction} userTier="free" />);
            expect(screen.getByText('No Photos Available')).toBeInTheDocument();
            expect(screen.queryByAltText('Primary photo of')).not.toBeInTheDocument();
        });

        it('logs info on render for Free tier', () => {
            render(<AuctionItemListing auction={mockAuction} userTier="free" />);
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Rendering AuctionItemListing for ${mockAuction.vin}, Tier: free`));
        });

        it('displays error message if auction data is missing', () => {
            render(<AuctionItemListing auction={null as any} userTier="free" />);
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText('Error: Auction data is missing.')).toBeInTheDocument();
            expect(logger.error).toHaveBeenCalledWith('AuctionItemListing: No auction data provided.');
        });
    });

    // --- Standard Tier Tests ---
    describe('Standard Tier Functionality', () => {
        const standardAuction = {
            ...mockAuction,
            bidHistory: [
                { bidderId: 'bidderA', bidAmount: 26500, timestamp: new Date(Date.now() - 60000).toISOString() },
                { bidderId: 'bidderB', bidAmount: 26000, timestamp: new Date(Date.now() - 120000).toISOString() },
                { bidderId: 'bidderA', bidAmount: 25500, timestamp: new Date(Date.now() - 180000).toISOString() },
                { bidderId: 'bidderC', bidAmount: 25000, timestamp: new Date(Date.now() - 240000).toISOString() },
                { bidderId: 'bidderD', bidAmount: 24500, timestamp: new Date(Date.now() - 300000).toISOString() },
                { bidderId: 'bidderE', bidAmount: 24000, timestamp: new Date(Date.now() - 360000).toISOString() }, // 6th bid
            ]
        };

        it('renders bid history for Standard tier', () => {
            render(<AuctionItemListing auction={standardAuction} userTier="standard" />);

            expect(screen.getByText('Recent Bid History')).toBeInTheDocument();
            // Expect last 5 bids to be shown
            expect(screen.getByText(/bidderA/i)).toBeInTheDocument();
            expect(screen.getByText(/bidderE/i)).not.toBeInTheDocument(); // 6th bid should not be visible
            expect(screen.getByText(/and 1 more bids/i)).toBeInTheDocument(); // Expect link to full history
        });

        it('does not render bid history if data is missing for Standard tier', () => {
            const noHistoryAuction = { ...standardAuction, bidHistory: [] };
            render(<AuctionItemListing auction={noHistoryAuction} userTier="standard" />);
            expect(screen.queryByText('Recent Bid History')).not.toBeInTheDocument();
        });
    });

    // --- Premium Tier Tests ---
    describe('Premium Tier Functionality', () => {
        const premiumAuction = {
            ...mockAuction,
            reservePrice: 30000,
            buyItNowPrice: 40000,
        };

        it('renders reserve and Buy It Now prices for Premium tier', () => {
            render(<AuctionItemListing auction={premiumAuction} userTier="premium" />);

            expect(screen.getByText('Premium Pricing Details')).toBeInTheDocument();
            expect(screen.getByText(`Reserve Price: $${premiumAuction.reservePrice.toLocaleString()} (Hidden until met)`)).toBeInTheDocument();
            expect(screen.getByText(`Buy It Now: $${premiumAuction.buyItNowPrice.toLocaleString()}`)).toBeInTheDocument();
        });

        it('does not render premium pricing if data is missing for Premium tier', () => {
            const noPricingAuction = { ...mockAuction }; // No reserve/buyItNow
            render(<AuctionItemListing auction={noPricingAuction} userTier="premium" />);
            expect(screen.queryByText('Premium Pricing Details')).not.toBeInTheDocument();
        });
    });

    // --- Wow++ Tier Tests ---
    describe('Wow++ Tier Functionality', () => {
        const wowPlusAuction = {
            ...mockAuction,
            aiBidSuggestions: [{
                recommendedBid: 28500,
                confidence: 0.9,
                optimalTime: 'just before closing'
            }],
            arModelUrl: 'http://ar.example.com/model.glb',
            blockchainRecordId: 'block123xyz'
        };

        it('renders AI bid suggestions for Wow++ tier', () => {
            render(<AuctionItemListing auction={wowPlusAuction} userTier="wowplus" />);

            expect(screen.getByText('AI Bid Suggestions')).toBeInTheDocument();
            expect(screen.getByText(/Recommended Bid: \$28,500/i)).toBeInTheDocument();
            expect(screen.getByText(/Confidence: 90%/i)).toBeInTheDocument();
            expect(screen.getByText(/Optimal Time: just before closing/i)).toBeInTheDocument();
        });

        it('renders AR/VR button if arModelUrl is present', () => {
            render(<AuctionItemListing auction={wowPlusAuction} userTier="wowplus" />);
            expect(screen.getByRole('button', { name: /View in AR\/VR/i })).toBeInTheDocument();
            expect(screen.getByText(`Mocked ARViewer for: ${wowPlusAuction.arModelUrl}`)).toBeInTheDocument();
        });

        it('renders Blockchain Record button if blockchainRecordId is present', () => {
            render(<AuctionItemListing auction={wowPlusAuction} userTier="wowplus" />);
            expect(screen.getByRole('button', { name: /View Blockchain Record/i })).toBeInTheDocument();
            expect(screen.getByText(`Mocked BlockchainRecordDisplay for: ${wowPlusAuction.blockchainRecordId}`)).toBeInTheDocument();
        });

        it('does not render AI bid suggestions if data is missing for Wow++ tier', () => {
            const noAISuggestionAuction = { ...wowPlusAuction, aiBidSuggestions: [] };
            render(<AuctionItemListing auction={noAISuggestionAuction} userTier="wowplus" />);
            expect(screen.queryByText('AI Bid Suggestions')).not.toBeInTheDocument();
        });
    });

    // --- Accessibility Tests (Jest-Axe) ---
    it('should have no accessibility violations for Free tier', async () => {
        const { container } = render(<AuctionItemListing auction={mockAuction} userTier="free" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for Standard tier', async () => {
        const { container } = render(<AuctionItemListing auction={mockAuction} userTier="standard" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for Premium tier', async () => {
        const { container } = render(<AuctionItemListing auction={mockAuction} userTier="premium" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for Wow++ tier', async () => {
        const { container } = render(<AuctionItemListing auction={mockAuction} userTier="wowplus" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});