/*
File: QualityCheckComponent.tsx
Path: C:\CFH\frontend\src\components\analytics\QualityCheckComponent.tsx
Created: 2025-07-02 12:55 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Quality check component for analytics with tiered features.
Artifact ID: v3w4x5y6-z7a8-b9c0-d1e2-f3g4h5i6j7k8
Version ID: w4x5y6z7-a8b9-c0d1-e2f3-g4h5i6j7k8l9
*/

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from '@/utils/toast'; // Assuming a toast notification utility
import logger from '@/utils/logger'; // Centralized logging utility
import { analyticsApi } from '@/services/analyticsApi'; // Assuming analytics API service
import { ChartWidget } from '@/components/analytics/ChartWidget'; // For displaying charts in Premium/Wow++ tiers

// Define prop types for the QualityCheckComponent
interface QualityCheckComponentProps {
    tier: 'free' | 'standard' | 'premium' | 'wowplus';
    // Assuming a userId or similar identifier might be passed for fetching user-specific quality data
    userId?: string;
}

// Define data structures for different tiers
interface FreeTierQualityData {
    basicValidationStatus: string; // e.g., "OK", "Warnings", "Errors"
    lastValidatedAt: string;
}

interface StandardTierQualityData extends FreeTierQualityData {
    standardMetricsSummary: string; // e.g., "Data freshness: Excellent"
    dataFreshnessScore: number; // e.g., 95
    completenessScore: number; // e.g., 98
}

interface PremiumTierQualityData extends StandardTierQualityData {
    detailedMetricsReport: string; // e.g., "Detailed report generated."
    dataQualityTrend: { date: string; score: number; }[]; // Data for a line chart
    errorDistribution: { type: string; count: number; }[]; // Data for a pie chart
}

interface WowPlusTierQualityData extends PremiumTierQualityData {
    aiInsightsSummary: string; // e.g., "AI detected 2 critical anomalies."
    anomalyList: { id: string; type: string; description: string; impact: string; }[];
    recommendations: string[];
}

const QualityCheckComponent: React.FC<QualityCheckComponentProps> = ({ tier, userId }) => {
    const [data, setData] = useState<any>(null); // Use 'any' for now, or a union type of all tier data interfaces
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // HTTPS check (client-side, for informational purposes)
    useEffect(() => {
        if (window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
            setError("Insecure connection detected. Please use HTTPS for quality checks.");
            logger.warn("Frontend attempting to load QualityCheckComponent over insecure HTTP in production.");
        }
    }, []);

    // Data fetching with retry logic
    const fetchData = useCallback(async (currentTier: string, retryCount = 0) => {
        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 1000; // 1 second delay

        setLoading(true);
        setError(null); // Clear previous errors

        try {
            const startTime = performance.now(); // CQS: <1s load time check

            // TODO: Integrate with analyticsApi.getQualityCheck
            // This API call would ideally return data specific to the requested tier
            // const response = await analyticsApi.getQualityCheck(userId, currentTier);

            // Mock data based on tier
            let mockResponseData: any;
            if (currentTier === 'free') {
                mockResponseData = {
                    basicValidationStatus: 'Data integrity: OK',
                    lastValidatedAt: new Date().toISOString(),
                } as FreeTierQualityData;
            } else if (currentTier === 'standard') {
                mockResponseData = {
                    basicValidationStatus: 'Data integrity: OK',
                    lastValidatedAt: new Date().toISOString(),
                    standardMetricsSummary: 'Data freshness: Excellent (95%), Completeness: Good (98%)',
                    dataFreshnessScore: 95,
                    completenessScore: 98,
                } as StandardTierQualityData;
            } else if (currentTier === 'premium') {
                mockResponseData = {
                    basicValidationStatus: 'Data integrity: OK',
                    lastValidatedAt: new Date().toISOString(),
                    standardMetricsSummary: 'Data freshness: Excellent (95%), Completeness: Good (98%)',
                    dataFreshnessScore: 95,
                    completenessScore: 98,
                    detailedMetricsReport: 'Comprehensive analysis completed. No critical issues detected.',
                    dataQualityTrend: [
                        { date: '2025-06-01', score: 90 }, { date: '2025-06-08', score: 92 },
                        { date: '2025-06-15', score: 95 }, { date: '2025-06-22', score: 94 }
                    ],
                    errorDistribution: [
                        { type: 'Missing Fields', count: 5 }, { type: 'Invalid Format', count: 2 }
                    ],
                } as PremiumTierQualityData;
            } else if (currentTier === 'wowplus') {
                mockResponseData = {
                    basicValidationStatus: 'Data integrity: OK',
                    lastValidatedAt: new Date().toISOString(),
                    standardMetricsSummary: 'Data freshness: Excellent (95%), Completeness: Good (98%)',
                    dataFreshnessScore: 95,
                    completenessScore: 98,
                    detailedMetricsReport: 'Comprehensive analysis completed. No critical issues detected.',
                    dataQualityTrend: [
                        { date: '2025-06-01', score: 90 }, { date: '2025-06-08', score: 92 },
                        { date: '2025-06-15', score: 95 }, { date: '2025-06-22', score: 94 }
                    ],
                    errorDistribution: [
                        { type: 'Missing Fields', count: 5 }, { type: 'Invalid Format', count: 2 }
                    ],
                    aiInsightsSummary: 'AI detected 2 potential data inconsistencies in recent bid logs.',
                    anomalyList: [
                        { id: 'anom1', type: 'Bid Log Discrepancy', description: 'Bid timestamp mismatch with server.', impact: 'High' },
                        { id: 'anom2', type: 'User Profile Inconsistency', description: 'Duplicate user account detected.', impact: 'Medium' }
                    ],
                    recommendations: ['Review bid log entry ID: XYZ', 'Merge user profiles ABC and DEF'],
                } as WowPlusTierQualityData;
            }

            // Simulate API call latency
            await new Promise(resolve => setTimeout(resolve, 300));

            setData(mockResponseData);

            const endTime = performance.now();
            const loadTimeMs = endTime - startTime;
            if (loadTimeMs > 1000) { // CQS: <1s load time
                logger.warn(`QualityCheckComponent load time exceeded 1s: ${loadTimeMs.toFixed(2)}ms for tier ${currentTier}`);
            }

        } catch (err: any) {
            logger.error(`Failed to load quality check data for tier ${currentTier} (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err);
            if (retryCount < MAX_RETRIES - 1) {
                toast.error(`Failed to load data. Retrying... (${retryCount + 1}/${MAX_RETRIES})`, { position: 'top-right' });
                setTimeout(() => fetchData(currentTier, retryCount + 1), RETRY_DELAY_MS); // Retry after delay
            } else {
                setError(err.response?.data?.message || 'Failed to load quality check data after multiple attempts.');
                toast.error(err.response?.data?.message || 'Failed to load quality check data.', { position: 'top-right' });
            }
        } finally {
            if (retryCount >= MAX_RETRIES - 1 || error === null) { // Only set loading to false after final attempt or success
                setLoading(false);
            }
        }
    }, [userId, error]); // Include error in dependency array to prevent infinite loop on retry

    useEffect(() => {
        fetchData(tier);
    }, [tier, fetchData]);

    if (loading) return <div className="text-center p-4">Loading quality check...</div>;
    if (error) return <div className="text-center p-4 text-red-600" role="alert">Error: {error}</div>;
    if (!data) return <div className="text-center p-4 text-gray-500">No quality check data available for this tier.</div>;

    return (
        <div className="quality-check-component p-4 bg-white rounded-lg shadow-md" aria-label={`Analytics quality check for ${tier} tier`}>
            <h2 className="text-xl font-bold mb-4">Analytics Quality Check ({tier.toUpperCase()} Tier)</h2>

            {/* Basic Data Validation (Free Tier and above) */}
            <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Basic Data Validation</h3>
                <p>Status: <span className={`font-medium ${data.basicValidationStatus.includes('OK') ? 'text-green-600' : 'text-red-600'}`}>{data.basicValidationStatus}</span></p>
                <p>Last Validated: {new Date(data.lastValidatedAt).toLocaleString()}</p>
            </section>

            {/* Standard Tier: Detailed Metrics Summary */}
            {(tier === 'standard' || tier === 'premium' || tier === 'wowplus') && (
                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Standard Quality Metrics</h3>
                    <p>{data.standardMetricsSummary}</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <p>Data Freshness Score: <span className="font-medium">{data.dataFreshnessScore}%</span></p>
                        <p>Completeness Score: <span className="font-medium">{data.completenessScore}%</span></p>
                    </div>
                </section>
            )}

            {/* Premium Tier: Detailed Metrics with Charts */}
            {(tier === 'premium' || tier === 'wowplus') && (
                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Detailed Quality Report</h3>
                    <p className="mb-4">{data.detailedMetricsReport}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.dataQualityTrend && (
                            <ChartWidget
                                title="Data Quality Trend"
                                type="line"
                                data={data.dataQualityTrend}
                                dataKeyX="date"
                                dataKeyY="score"
                                userTier={tier}
                            />
                        )}
                        {data.errorDistribution && (
                            <ChartWidget
                                title="Error Distribution"
                                type="pie"
                                data={data.errorDistribution}
                                pieDataKey="count"
                                pieNameKey="type"
                                userTier={tier}
                            />
                        )}
                    </div>
                </section>
            )}

            {/* Wow++ Tier: AI-driven Quality Insights */}
            {tier === 'wowplus' && (
                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">AI-Driven Quality Insights</h3>
                    <p className="mb-4">{data.aiInsightsSummary}</p>
                    {data.anomalyList && data.anomalyList.length > 0 && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded-md mb-4">
                            <h4 className="font-semibold text-red-800">Detected Anomalies:</h4>
                            <ul className="list-disc list-inside text-sm text-red-700">
                                {data.anomalyList.map((anomaly: any) => (
                                    <li key={anomaly.id}>
                                        **{anomaly.type}**: {anomaly.description} (Impact: {anomaly.impact})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {data.recommendations && data.recommendations.length > 0 && (
                        <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                            <h4 className="font-semibold text-green-800">AI Recommendations:</h4>
                            <ul className="list-disc list-inside text-sm text-green-700">
                                {data.recommendations.map((rec: string, idx: number) => (
                                    <li key={idx}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default QualityCheckComponent;