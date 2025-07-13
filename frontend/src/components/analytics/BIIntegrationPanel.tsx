/*
File: BIIntegrationPanel.tsx
Path: C:\CFH\frontend\src\components\analytics\BIIntegrationPanel.tsx
Created: 2025-07-02 12:45 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: BI integration panel component for the Analytics Dashboard.
Artifact ID: r9s0t1u2-v3w4-x5y6-z7a8-b9c0d1e2f3g4
Version ID: s0t1u2v3-w4x5-y6z7-a8b9-c0d1e2f3g4h5
*/

import React, { useState, useCallback } from 'react';
import { toast } from '@/utils/toast'; // Assuming a toast notification utility
import logger from '@/utils/logger'; // Centralized logging utility
import { analyticsApi } from '@/services/analyticsApi'; // Assuming analytics API service

// Define prop types for the BIIntegrationPanel
interface BIIntegrationPanelProps {
    userTier: 'free' | 'standard' | 'premium' | 'wowplus';
    onIntegrationAttempt?: (tool: string, success: boolean, message?: string) => void; // Optional callback for parent
}

const BIIntegrationPanel: React.FC<BIIntegrationPanelProps> = ({ userTier, onIntegrationAttempt }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [integrationStatus, setIntegrationStatus] = useState<string | null>(null); // To show status of last attempt

    const handleIntegrate = useCallback(async (tool: 'Tableau' | 'Power BI' | 'Other') => {
        if (userTier !== 'wowplus') {
            toast.error('Business Intelligence integration is available exclusively in the Wow++ tier.', { position: 'top-right' });
            logger.info(`BIIntegrationPanel: User (tier: ${userTier}) attempted to use Wow++ feature.`);
            if (onIntegrationAttempt) onIntegrationAttempt(tool, false, 'Tier access denied');
            return;
        }

        setIsLoading(true);
        setIntegrationStatus(null); // Clear previous status
        const startTime = performance.now(); // CQS: <1s render/response check

        try {
            // TODO: Call analyticsApi for BI integration.
            // This would typically involve:
            // 1. Sending user's authentication details (e.g., API key, OAuth token) for the BI tool (securely).
            // 2. Backend initiating data export/connection setup with the BI tool's API.
            // 3. Backend returning a connection URL or status.
            // For local testing, we mock this.
            // const response = await analyticsApi.initiateBIIntegration(tool);

            // Mocking API response for local testing
            const mockResponse = {
                status: 'success',
                message: `Successfully initiated connection to ${tool}. Please check your ${tool} dashboard.`,
                connectionUrl: `https://mock-bi-tool.com/connect?token=mock_${tool}_token` // Example URL
            };
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call latency

            setIntegrationStatus(mockResponse.message);
            toast.success(`Connecting to ${tool}... ${mockResponse.message}`, { position: 'top-right' });
            logger.info(`BIIntegrationPanel: Integration with ${tool} initiated successfully.`);
            if (onIntegrationAttempt) onIntegrationAttempt(tool, true, mockResponse.message);

            const endTime = performance.now();
            const responseTimeMs = endTime - startTime;
            if (responseTimeMs > 1000) { // CQS: <1s response
                logger.warn(`BIIntegrationPanel integration response time exceeded 1s: ${responseTimeMs.toFixed(2)}ms for ${tool}`);
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || `Failed to integrate with ${tool}. Please ensure your credentials are correct.`;
            setIntegrationStatus(`Failed: ${errorMessage}`);
            toast.error(errorMessage, { position: 'top-right' });
            logger.error(`BIIntegrationPanel: Error integrating with ${tool}:`, error);
            if (onIntegrationAttempt) onIntegrationAttempt(tool, false, errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [userTier, onIntegrationAttempt]);

    // CQS: accessibility with `aria-label`
    return (
        <div className="bi-integration-panel p-4 bg-white rounded-lg shadow-md" aria-label="Business Intelligence Integration Panel">
            <h3 className="text-lg font-semibold mb-2">Business Intelligence Integration</h3>
            {userTier === 'wowplus' ? (
                <div className="flex flex-col gap-3">
                    <p className="text-sm text-gray-700">Connect your analytics data to your favorite BI tools for advanced reporting.</p>
                    <button
                        onClick={() => handleIntegrate('Tableau')}
                        className="btn bg-red-600 text-white hover:bg-red-700"
                        disabled={isLoading}
                        aria-label="Connect to Tableau"
                    >
                        {isLoading ? 'Connecting...' : 'Connect to Tableau'}
                    </button>
                    <button
                        onClick={() => handleIntegrate('Power BI')}
                        className="btn bg-yellow-600 text-white hover:bg-yellow-700"
                        disabled={isLoading}
                        aria-label="Connect to Power BI"
                    >
                        {isLoading ? 'Connecting...' : 'Connect to Power BI'}
                    </button>
                    {/* Add more BI tools as needed */}
                    <button
                        onClick={() => handleIntegrate('Other')}
                        className="btn bg-gray-600 text-white hover:bg-gray-700"
                        disabled={isLoading}
                        aria-label="Connect to other BI tools"
                    >
                        Connect to Other BI Tools
                    </button>
                    {integrationStatus && (
                        <p className="text-sm mt-2 text-center text-gray-600" aria-live="polite">{integrationStatus}</p>
                    )}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-4">
                    <p>Unlock advanced BI integration with a **Wow++** tier subscription.</p>
                </div>
            )}
        </div>
    );
};

export default BIIntegrationPanel;