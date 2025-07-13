/*
File: AnalyticsDashboard.tsx
Path: C:\CFH\frontend\src\components\analytics\AnalyticsDashboard.tsx
Created: 2025-07-02 12:10 PDT
Author: Mini (AI Assistant)
Version: 1.1
Description: Enhanced main container component for the Analytics Dashboard feature with full tier support.
Artifact ID: f1e2d3c4-b5a6-7890-1234-567890abcdef
Version ID: g2h3i4j5-k6l7-890a-bcde-f12345678901
*/

import React, { useState, useEffect, useCallback } from 'react';
import logger from '@/utils/logger'; // Centralized logging utility
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ValuationDisplay } from '@/components/common/ValuationDisplay';
import { PredictiveGraph } from '@/components/common/PredictiveGraph';
import { FilterPanel } from '@/components/analytics/FilterPanel';
import { ChartWidget } from '@/components/analytics/ChartWidget';
import { DataTable } from '@/components/analytics/DataTable';
// import { NLPQueryInput } from '@/components/analytics/NLPQueryInput'; // For Wow++ NLP queries
// import { BIIntegrationPanel } from '@/components/analytics/BIIntegrationPanel'; // For Wow++ BI integration
import { analyticsApi } from '@/services/analyticsApi'; // API service for fetching analytics data
import { useAuth } from '@/contexts/AuthContext'; // Assuming AuthContext provides user tier information

// Define types for data and filters for better type safety
interface DashboardData {
    userActivity?: { bidsMade: number; servicesBooked: number; forumPosts: number };
    platformOverview?: { totalListings: number; activeAuctions: number; totalUsers: number; };
    basicBusinessMetrics?: { listingViews: number; inquiries: number; ratings: number; };
    basicTrends?: { marketTrends: any[]; salesStats: any[]; };
    interactiveChartsData?: any; // Data for interactive charts
    customReport?: any;
    aiInsights?: any;
    predictiveAnalytics?: any;
    sentimentAnalysis?: any;
    crossModuleAttribution?: any;
    valuation?: { value: number; confidence: number };
    forecast?: any;
    sales?: any; // Example data for charts/graphs
    listings?: { headers: string[]; rows: any[]; };
    // Add more specific types as data structures from backend evolve
}

interface AnalyticsFilters {
    timeRange?: string;
    module?: string;
    // Add custom filter types as per FilterPanel implementation
    startDate?: string;
    endDate?: string;
    // For NLP queries
    nlpQuery?: string;
}

const AnalyticsDashboardWrapper: React.FC = () => {
    const { user } = useAuth(); // Assuming user object contains tier: 'free' | 'standard' | 'premium' | 'wowplus'
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentFilters, setCurrentFilters] = useState<AnalyticsFilters>({});

    // Determine current user tier for dynamic component rendering
    const userTier = user?.tier || 'free'; // Default to 'free' if not authenticated or tier not found

    // Function to ensure HTTPS (client-side check for informational purposes)
    // Actual enforcement should be primarily on the backend
    useEffect(() => {
        if (window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
            setError("Insecure connection detected. Please use HTTPS for full functionality.");
            logger.warn("Frontend attempting to load dashboard over insecure HTTP in production.");
        }
    }, []);

    // Fetch data with retry logic
    const fetchData = useCallback(async (filters: AnalyticsFilters, retryCount = 0) => {
        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 1000; // 1 second delay

        setLoading(true);
        setError(null); // Clear previous errors
        setCurrentFilters(filters); // Keep track of current filters

        try {
            const businessId = user?.userId; // Using userId as businessId placeholder
            if (!businessId) {
                setError('Authentication required to load dashboard data.');
                setLoading(false);
                return;
            }

            const startTime = performance.now(); // CQS: <1s load time check

            // Adjust API calls based on user tier and selected filters
            let response: any;
            if (userTier === 'free') {
                response = await analyticsApi.getDashboardData('dashboard', businessId, filters); // Simplified call for free
            } else if (userTier === 'standard') {
                response = await analyticsApi.getDashboardData('data/standard', businessId, filters);
            } else if (userTier === 'premium') {
                response = await analyticsApi.getDashboardData('data', businessId, filters);
            } else if (userTier === 'wowplus') {
                // Wow++ might fetch multiple data points or use specialized endpoints
                const aiInsights = await analyticsApi.getDashboardData('forecast', businessId, filters);
                const platformAttribution = await analyticsApi.getDashboardData('platform/attribution', businessId, filters);
                response = {
                    data: {
                        ...(await analyticsApi.getDashboardData('data', businessId, filters)).data,
                        aiInsights: aiInsights.data,
                        platformAttribution: platformAttribution.data,
                        // NLP and BI integration would trigger separate actions/components
                    }
                };
            }

            setDashboardData(response.data);

            const endTime = performance.now();
            const loadTimeMs = endTime - startTime;
            if (loadTimeMs > 1000) { // CQS: <1s load time (frontend perception)
                logger.warn(`Analytics dashboard load time exceeded 1s: ${loadTimeMs.toFixed(2)}ms for tier ${userTier}`);
            }

        } catch (err: any) {
            logger.error(`Failed to load dashboard data for user ${user?.userId} (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err);
            if (retryCount < MAX_RETRIES - 1) {
                setError(`Failed to load data. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                setTimeout(() => fetchData(filters, retryCount + 1), RETRY_DELAY_MS); // Retry after delay
            } else {
                setError(err.response?.data?.message || 'Failed to load dashboard data after multiple attempts.');
            }
        } finally {
            if (retryCount >= MAX_RETRIES - 1 || error === null) { // Only set loading to false after final attempt or success
                setLoading(false);
            }
        }
    }, [user?.userId, userTier]);

    useEffect(() => {
        if (user?.userId) { // Only fetch if user is authenticated
            fetchData({}); // Initial fetch
        } else {
            setLoading(false);
            setError('Please log in to view analytics.');
        }
    }, [user?.userId, fetchData]);

    const handleFilterChange = (newFilters: AnalyticsFilters) => {
        fetchData(newFilters);
    };

    if (!user?.userId) {
        return <div className="text-center p-4">Please log in to view analytics.</div>;
    }

    if (loading) return <div className="text-center p-4">Loading dashboard...</div>;
    if (error) return <div className="text-center p-4" role="alert">{error}</div>; // CQS: display errors with role="alert"
    if (!dashboardData) return <div className="text-center p-4">No analytics data available for your tier.</div>;

    // --- Conditional Rendering based on Tier ---
    return (
        <div className="analytics-dashboard-container flex">
            <FilterPanel onFilterChange={handleFilterChange} userTier={userTier} />

            <main className="dashboard-content flex-1 p-4">
                <h1 className="text-2xl font-bold mb-4">Analytics Dashboard ({userTier.toUpperCase()} Tier)</h1>

                {/* Free Tier Features */}
                {userTier === 'free' && (
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Your Activity Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ChartWidget title="Bids Made" type="bar" data={dashboardData.userActivity?.bidsMade || 0} />
                            <ChartWidget title="Services Booked" type="bar" data={dashboardData.userActivity?.servicesBooked || 0} />
                            <ChartWidget title="Forum Posts" type="bar" data={dashboardData.userActivity?.forumPosts || 0} />
                        </div>
                        <h2 className="text-xl font-semibold mt-6 mb-2">Basic Platform Metrics (Last 30 Days)</h2>
                        <DataTable
                            title="Platform Summary"
                            headers={['Metric', 'Value']}
                            rows={[
                                { Metric: 'Total Listings', Value: dashboardData.platformOverview?.totalListings || 0 },
                                { Metric: 'Active Auctions', Value: dashboardData.platformOverview?.activeAuctions || 0 },
                                { Metric: 'Total Users', Value: dashboardData.platformOverview?.totalUsers || 0 },
                            ]}
                        />
                        {/* CSV Export is a shared "should have" for export utils */}
                        {/* TODO: Add CSV export button (requires `auctionExportUtils.js` integration) */}
                        <button className="btn mt-4">Export to CSV</button>
                    </section>
                )}

                {/* Standard Tier Features */}
                {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && (
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Detailed Performance Metrics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Example of interactive charts, assuming ChartWidget supports different types */}
                            <ChartWidget title="Bids vs Views" type="line" data={dashboardData.interactiveChartsData?.bidsViews || []} />
                            <ChartWidget title="Sales by Category" type="pie" data={dashboardData.interactiveChartsData?.salesByCategory || []} />
                        </div>
                        <h2 className="text-xl font-semibold mt-6 mb-2">Top Listings Performance</h2>
                        <DataTable
                            title="Top Listings Performance"
                            headers={dashboardData.listings?.headers || []}
                            rows={dashboardData.listings?.rows || []}
                            sortable={true} // Standard: Sort/filter tables
                            filterable={true}
                        />
                         {/* TODO: Add print view functionality */}
                         <button className="btn mt-4">Print Report</button>
                    </section>
                )}

                {/* Premium Tier Features */}
                {(userTier === 'premium' || userTier === 'wowplus') && (
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Advanced Business Insights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ChartWidget title="Conversion Funnel" type="funnel" data={dashboardData.customReport?.conversionFunnel || []} />
                            <ChartWidget title="Revenue by Quarter" type="bar" data={dashboardData.customReport?.revenueByQuarter || []} />
                            <ChartWidget title="Customer Demographics" type="doughnut" data={dashboardData.customReport?.customerDemographics || []} />
                        </div>
                        <h2 className="text-xl font-semibold mt-6 mb-2">Custom Report Builder</h2>
                        {/* Placeholder for custom report builder UI. This would be a complex component itself. */}
                        <div className="border p-4 rounded-md bg-gray-50">
                            <p>Drag-and-drop interface for building custom reports goes here.</p>
                            {/* TODO: Integrate with backend's POST /analytics/custom endpoint */}
                            <button className="btn mt-4">Build Custom Report</button>
                        </div>
                        {/* PDF Export is a shared "should have" for export utils */}
                        {/* TODO: Add PDF export button (requires `auctionExportUtils.js` integration) */}
                        <button className="btn mt-4">Export to PDF</button>
                    </section>
                )}

                {/* Wow++ Tier Features */}
                {userTier === 'wowplus' && (
                    <section>
                        <h2 className="text-xl font-semibold mb-2">AI-Powered Insights & Predictions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dashboardData.valuation && (
                                <ValuationDisplay
                                    valuation={dashboardData.valuation.value}
                                    confidence={dashboardData.valuation.confidence}
                                    // Wow++: Interactive tooltips for metrics
                                    // Wow++: Comparison feature for valuation changes over time (mini graph)
                                />
                            )}
                            {dashboardData.forecast && (
                                <PredictiveGraph
                                    data={dashboardData.sales || []} // Assuming sales data is baseline
                                    predictionLine={dashboardData.forecast}
                                    // Wow++: Interactive zoom and pan for large datasets
                                    // Wow++: Animated transitions for data updates
                                    // Wow++: Export options for graphs
                                />
                            )}
                        </div>
                        <h2 className="text-xl font-semibold mt-6 mb-2">Advanced Analytics Tools</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* TODO: Integrate NLP Query Input component */}
                            {/* <NLPQueryInput onQuerySubmit={(query) => console.log('NLP Query:', query)} /> */}
                            <div className="border p-4 rounded-md bg-gray-50">
                                <h3 className="font-medium">Natural Language Query (NLP)</h3>
                                <p>Type your analytics question: "Show Q1 vs. Q2 sales for SUVs."</p>
                                {/* Placeholder for NLP input field */}
                                <input type="text" placeholder="Ask your question..." className="input input-bordered w-full mt-2" />
                                <button className="btn mt-2">Get Answer</button>
                            </div>
                            {/* TODO: Integrate BI Integration Panel component */}
                            {/* <BIIntegrationPanel onIntegrate={(biTool) => console.log('Integrating with:', biTool)} /> */}
                             <div className="border p-4 rounded-md bg-gray-50">
                                <h3 className="font-medium">Business Intelligence Integration</h3>
                                <p>Connect to Tableau, Power BI, or other BI tools.</p>
                                {/* Placeholder for BI integration options */}
                                <button className="btn mt-2 mr-2">Connect to Tableau</button>
                                <button className="btn mt-2">Connect to Power BI</button>
                            </div>
                        </div>
                        {/* TODO: Add "Analytics Ace" badge display logic */}
                        {/* TODO: Add points redemption logic */}
                    </section>
                )}
            </main>
        </div>
    );
};

// Error Boundary ensures the whole app doesn't crash if AnalyticsDashboard has issues
export const AnalyticsDashboard: React.FC = () => (
    <ErrorBoundary>
        <AnalyticsDashboardWrapper />
    </ErrorBoundary>
);

export default AnalyticsDashboard;