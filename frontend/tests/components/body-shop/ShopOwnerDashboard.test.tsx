/*
File: ShopOwnerDashboard.test.tsx
Path: C:\CFH\frontend\tests\components\body-shop\ShopOwnerDashboard.test.tsx
Created: 2025-07-04 11:30 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for ShopOwnerDashboard component with tiered features and accessibility checks.
Artifact ID: q9r0s1t2-u3v4-w5x6-y7z8-a9b0c1d2e3f4
Version ID: r0s1t2u3-v4w5-x6y7-z8a9-b0c1d2e3f4g5
*/

import React from 'react';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe'; // For accessibility testing

// Extend Jest with jest-axe matchers
expect.extend(toHaveNoViolations);

import ShopOwnerDashboard from '@/components/body-shop/ShopOwnerDashboard';
import { bodyShopApi } from '@/services/bodyShopApi'; // Mock the API service
import logger from '@/utils/logger'; // Mock logger
import { toast } from '@/utils/toast'; // Mock toast notifications

// Mock external dependencies
jest.mock('@/services/bodyShopApi', () => ({
    bodyShopApi: {
        getShopDashboard: jest.fn(),
    },
}));
jest.mock('@/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));
jest.mock('@/utils/toast', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
    },
}));

// Mock child components if they have complex rendering or API calls
jest.mock('@/components/analytics/ChartWidget', () => ({
    ChartWidget: ({ title, data, type }: any) => (
        <div data-testid={`mock-chart-widget-${type}-${title.replace(/\s/g, '-')}`}>
            Mock Chart: {title}
        </div>
    ),
}));
jest.mock('@/components/analytics/DataTable', () => ({
    DataTable: ({ title, headers, rows }: any) => (
        <div data-testid={`mock-data-table-${title.replace(/\s/g, '-')}`}>
            Mock DataTable: {title} ({rows.length} rows)
        </div>
    ),
}));

describe('ShopOwnerDashboard', () => {
    const mockShopId = 'shop123';
    const baseMockData = {
        shopId: mockShopId,
        profile: {
            name: 'Test Body Shop',
            services: ['Collision Repair'],
            hours: 'Mon-Fri: 9AM-5PM',
            contact: 'test@example.com',
        },
        estimateRequests: [],
        jobTracking: [],
        dashboardStats: { totalRequests: 0, quotedRequests: 0, acceptedJobs: 0 },
    };

    beforeEach(() => {
        cleanup(); // Clean up DOM after each test
        jest.clearAllMocks(); // Clear mock calls
        // Set default mock implementation for getShopDashboard
        (bodyShopApi.getShopDashboard as jest.Mock).mockResolvedValue({ data: baseMockData });
    });

    // --- Initial Loading and Error States ---
    it('renders loading state initially', () => {
        (bodyShopApi.getShopDashboard as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Never resolve
        render(<ShopOwnerDashboard shopId={mockShopId} userTier="free" />);
        expect(screen.getByText('Loading shop dashboard...')).toBeInTheDocument();
    });

    it('displays error if shopId is missing', async () => {
        render(<ShopOwnerDashboard shopId={''} userTier="free" />);
        await waitFor(() => {
            expect(screen.getByText('Shop ID is required to view the dashboard.')).toBeInTheDocument();
        });
        expect(bodyShopApi.getShopDashboard).not.toHaveBeenCalled();
    });

    it('displays error message on API failure', async () => {
        (bodyShopApi.getShopDashboard as jest.Mock).mockRejectedValueOnce({ response: { data: { message: 'Network error' } } });
        render(<ShopOwnerDashboard shopId={mockShopId} userTier="free" />);
        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText('Error: Network error')).toBeInTheDocument();
        });
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to load shop dashboard'), expect.any(Object));
        expect(toast.error).toHaveBeenCalledWith('Network error', expect.any(Object));
    });

    it('displays "No dashboard data available" if API returns null data', async () => {
        (bodyShopApi.getShopDashboard as jest.Mock).mockResolvedValueOnce({ data: null });
        render(<ShopOwnerDashboard shopId={mockShopId} userTier="free" />);
        await waitFor(() => {
            expect(screen.getByText('No dashboard data available for your shop.')).toBeInTheDocument();
        });
    });

    // --- Free Tier Tests ---
    describe('Free Tier Functionality', () => {
        const freeTierData = {
            ...baseMockData,
            profile: { ...baseMockData.profile, services: ['Collision Repair'] },
            estimateRequests: [{ id: 'est1', vehicle: 'Tesla', damage: 'Bumper', status: 'New', requestedAt: '2025-07-01T00:00:00Z' }],
            jobTracking: [{ id: 'job1', vehicle: 'Honda', status: 'In Progress', startDate: '2025-07-01T00:00:00Z' }],
            dashboardStats: { totalRequests: 1, quotedRequests: 0, acceptedJobs: 0 },
        };

        beforeEach(() => {
            (bodyShopApi.getShopDashboard as jest.Mock).mockResolvedValue({ data: freeTierData });
        });

        it('renders basic profile management and limited data for Free tier', async () => {
            render(<ShopOwnerDashboard shopId={mockShopId} userTier="free" />);
            await waitFor(() => {
                expect(screen.getByText('Test Body Shop Dashboard (FREE Tier)')).toBeInTheDocument();
                expect(screen.getByText('Shop Profile')).toBeInTheDocument();
                expect(screen.getByText('Services: Collision Repair')).toBeInTheDocument();
                expect(screen.getByText('Edit Profile')).toBeInTheDocument();
                expect(screen.getByText('No new estimate requests found.')).toBeInTheDocument(); // Free tier shows limited requests
                expect(screen.getByText('No active jobs found.')).toBeInTheDocument(); // Free tier shows limited jobs
                expect(screen.getByText('Total Auctions: 0')).toBeInTheDocument(); // From dashboardStats
            });
            expect(bodyShopApi.getShopDashboard).toHaveBeenCalledWith(mockShopId, 'free');
        });

        it('displays correct dashboard stats for Free tier', async () => {
            render(<ShopOwnerDashboard shopId={mockShopId} userTier="free" />);
            await waitFor(() => {
                expect(screen.getByText('Total Auctions: 0')).toBeInTheDocument();
                expect(screen.getByText('Active Auctions: 0')).toBeInTheDocument();
                expect(screen.getByText('Auctions Won: 0')).toBeInTheDocument();
                expect(screen.getByText('Auctions Lost: 0')).toBeInTheDocument();
            });
        });

        it('logs info on render for Free tier', async () => {
            render(<ShopOwnerDashboard shopId={mockShopId} userTier="free" />);
            await waitFor(() => {
                expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Rendering ShopOwnerDashboard for shop ${mockShopId}, tier: free`));
            });
        });
    });

    // --- Standard Tier Tests ---
    describe('Standard Tier Functionality', () => {
        const standardTierData = {
            ...baseMockData,
            profile: { ...baseMockData.profile, services: ['Collision Repair', 'Paint Jobs'] },
            estimateRequests: [
                { id: 'est1', vehicle: 'Tesla', damage: 'Bumper', status: 'New', requestedAt: '2025-07-03T10:00:00Z' },
                { id: 'est2', vehicle: 'Ford', damage: 'Door', status: 'Quoted', requestedAt: '2025-07-02T14:00:00Z' },
            ],
            jobTracking: [
                { id: 'job1', vehicle: 'Honda', status: 'In Progress', startDate: '2025-07-01T09:00:00Z' },
                { id: 'job2', vehicle: 'Toyota', status: 'Scheduled', startDate: '2025-07-03T11:00:00Z' },
            ],
            dashboardStats: { totalRequests: 2, quotedRequests: 1, acceptedJobs: 1 },
        };

        beforeEach(() => {
            (bodyShopApi.getShopDashboard as jest.Mock).mockResolvedValue({ data: standardTierData });
        });

        it('renders estimate and job management for Standard tier', async () => {
            render(<ShopOwnerDashboard shopId={mockShopId} userTier="standard" />);
            await waitFor(() => {
                expect(screen.getByText('Estimate Requests')).toBeInTheDocument();
                expect(screen.getByText('Mock DataTable: Recent Estimate Requests (2 rows)')).toBeInTheDocument();
                expect(screen.getByText('Job Tracking')).toBeInTheDocument();
                expect(screen.getByText('Mock DataTable: Current Jobs (2 rows)')).toBeInTheDocument();
                expect(screen.getByText('View Basic Reports')).toBeInTheDocument();
                expect(screen.getByText('Message Customer')).toBeInTheDocument();
            });
            expect(bodyShopApi.getShopDashboard).toHaveBeenCalledWith(mockShopId, 'standard');
        });
    });

    // --- Premium Tier Tests ---
    describe('Premium Tier Functionality', () => {
        const premiumTierData = {
            ...baseMockData,
            profile: { ...baseMockData.profile, isCFHVerified: true },
            analytics: {
                revenueTrend: [{ month: 'Jan', value: 10000 }, { month: 'Feb', value: 12000 }],
                leadConversionRate: 0.15,
                customerSatisfactionScore: 4.7,
            },
            dashboardStats: { totalRequests: 5, quotedRequests: 3, acceptedJobs: 2 },
        };

        beforeEach(() => {
            (bodyShopApi.getShopDashboard as jest.Mock).mockResolvedValue({ data: premiumTierData });
        });

        it('renders enhanced visibility and advanced analytics for Premium tier', async () => {
            render(<ShopOwnerDashboard shopId={mockShopId} userTier="premium" />);
            await waitFor(() => {
                expect(screen.getByText('Premium Business Tools')).toBeInTheDocument();
                expect(screen.getByText('👑 Verified by CFH (Enhanced Visibility)')).toBeInTheDocument();
                expect(screen.getByText('Mock Chart: Revenue-Trend')).toBeInTheDocument();
                expect(screen.getByText('Lead Conversion Rate')).toBeInTheDocument();
                expect(screen.getByText('15%')).toBeInTheDocument();
                expect(screen.getByText('Customer Satisfaction')).toBeInTheDocument();
                expect(screen.getByText('4.7 / 5')).toBeInTheDocument();
                expect(screen.getByText('Lead Generation Tools')).toBeInTheDocument();
                expect(screen.getByText('Manage Staff Accounts')).toBeInTheDocument();
            });
            expect(bodyShopApi.getShopDashboard).toHaveBeenCalledWith(mockShopId, 'premium');
        });
    });

    // --- Wow++ Tier Tests ---
    describe('Wow++ Tier Functionality', () => {
        const wowPlusTierData = {
            ...baseMockData,
            aiPricingInsights: {
                recommendations: ['Adjust pricing for luxury vehicles.'],
                optimalPriceRange: '$1000 - $1200 for minor dents.'
            },
            automatedFollowUpSuggestions: ['Send follow-up email to customer X.'],
            performanceBenchmarks: {
                avgRepairTime: '5 days',
                customerRetention: '85%'
            },
            dashboardStats: { totalRequests: 10, quotedRequests: 5, acceptedJobs: 3 },
        };

        beforeEach(() => {
            (bodyShopApi.getShopDashboard as jest.Mock).mockResolvedValue({ data: wowPlusTierData });
        });

        it('renders AI pricing, automated follow-ups, and benchmarking for Wow++ tier', async () => {
            render(<ShopOwnerDashboard shopId={mockShopId} userTier="wowplus" />);
            await waitFor(() => {
                expect(screen.getByText('Wow++ AI & Automation')).toBeInTheDocument();
                expect(screen.getByText('AI Pricing Insights')).toBeInTheDocument();
                expect(screen.getByText('Adjust pricing for luxury vehicles.')).toBeInTheDocument();
                expect(screen.getByText('Automated Follow-up Suggestions')).toBeInTheDocument();
                expect(screen.getByText('Parts Supplier Marketplace')).toBeInTheDocument();
                expect(screen.getByText('View Performance Benchmarks')).toBeInTheDocument();
                expect(screen.getByText('Earned by shops achieving high performance benchmarks.')).toBeInTheDocument();
            });
            expect(bodyShopApi.getShopDashboard).toHaveBeenCalledWith(mockShopId, 'wowplus');
        });
    });

    // --- Accessibility Tests (Jest-Axe) ---
    it('should have no accessibility violations for Free tier', async () => {
        (bodyShopApi.getShopDashboard as jest.Mock).mockResolvedValue({ data: baseMockData });
        const { container } = render(<ShopOwnerDashboard shopId={mockShopId} userTier="free" />);
        await waitFor(() => expect(screen.getByText('Test Body Shop Dashboard (FREE Tier)')).toBeInTheDocument());
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for Wow++ tier', async () => {
        (bodyShopApi.getShopDashboard as jest.Mock).mockResolvedValue({ data: { ...baseMockData, ...{ aiPricingInsights: { recommendations: ['test'], optimalPriceRange: 'test' } } } }); // Ensure data for Wow++ features
        const { container } = render(<ShopOwnerDashboard shopId={mockShopId} userTier="wowplus" />);
        await waitFor(() => expect(screen.getByText('Test Body Shop Dashboard (WOWPLUS Tier)')).toBeInTheDocument());
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});