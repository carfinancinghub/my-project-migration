/*
File: NLPQueryInput.tsx
Path: C:\CFH\frontend\src\components\analytics\NLPQueryInput.tsx
Created: 2025-07-02 12:40 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: NLP query input component for the Analytics Dashboard.
Artifact ID: p7q8r9s0-t1u2-v3w4-x5y6-z7a8b9c0d1e2
Version ID: q8r9s0t1-u2v3-w4x5-y6z7-a8b9c0d1e2f3
*/

import React, { useState, useCallback } from 'react';
import { toast } from '@/utils/toast'; // Assuming a toast notification utility
import logger from '@/utils/logger'; // Centralized logging utility
import { analyticsApi } from '@/services/analyticsApi'; // Assuming analytics API service

// Define prop types for the NLPQueryInput
interface NLPQueryInputProps {
    userTier: 'free' | 'standard' | 'premium' | 'wowplus';
    onQueryResult: (result: any) => void; // Callback to send parsed/API result back to parent
    onLoadingChange?: (isLoading: boolean) => void; // Optional callback for loading state
}

const NLPQueryInput: React.FC<NLPQueryInputProps> = ({ userTier, onQueryResult, onLoadingChange }) => {
    const [query, setQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (userTier !== 'wowplus') {
            toast.error('Natural Language Queries are available in the Wow++ tier.', { position: 'top-right' });
            logger.info(`NLPQueryInput: User (tier: ${userTier}) attempted to use Wow++ feature.`);
            return;
        }

        if (!query.trim()) {
            toast.error('Please enter your analytics question.', { position: 'top-right' });
            logger.warn('NLPQueryInput: Empty query submitted.');
            return;
        }

        setIsLoading(true);
        if (onLoadingChange) onLoadingChange(true);
        const startTime = performance.now(); // CQS: <1s response check

        try {
            // TODO: Call analyticsApi for NLP integration
            // This endpoint would send the natural language query to the backend,
            // which in turn would use an NLP service to parse it and fetch relevant data.
            // const response = await analyticsApi.postNLPQuery(query);
            
            // Mocking API response for local testing
            const mockResponse = {
                status: 'success',
                parsedQuery: query,
                data: {
                    type: 'summary',
                    text: `Based on your query "${query}", here's a simulated response: Total Q1 sales: $150,000. Total Q2 sales: $180,000. Sales for SUVs in Q1: $50,000.`,
                    chartData: [{ name: 'Q1', sales: 150000 }, { name: 'Q2', sales: 180000 }] // Example chart data
                }
            };
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call latency

            onQueryResult(mockResponse.data); // Pass the processed data back to the parent component
            logger.info(`NLPQueryInput: Query "${query}" processed successfully.`);

            const endTime = performance.now();
            const responseTimeMs = endTime - startTime;
            if (responseTimeMs > 1000) { // CQS: <1s response
                logger.warn(`NLPQueryInput response time exceeded 1s: ${responseTimeMs.toFixed(2)}ms for query "${query}"`);
            }

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to process your query. Please try again.', { position: 'top-right' });
            logger.error(`NLPQueryInput: Error processing query "${query}":`, error);
        } finally {
            setIsLoading(false);
            if (onLoadingChange) onLoadingChange(false);
        }
    }, [query, userTier, onQueryResult, onLoadingChange]);

    // CQS: accessibility with `aria-label`
    return (
        <div className="nlp-query-input p-4 bg-white rounded-lg shadow-md" aria-label="Natural language query input for analytics">
            <h3 className="text-lg font-semibold mb-2">Natural Language Query</h3>
            {userTier === 'wowplus' ? (
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="e.g., 'Show Q1 vs. Q2 sales for SUVs'"
                        value={query}
                        onChange={handleQueryChange}
                        className="input input-bordered w-full"
                        disabled={isLoading}
                        aria-label="Enter your analytics question"
                    />
                    <button
                        onClick={handleSubmit}
                        className="btn bg-blue-600 text-white hover:bg-blue-700"
                        disabled={isLoading}
                        aria-label="Submit analytics query"
                    >
                        {isLoading ? 'Processing...' : 'Get Answer'}
                    </button>
                    {isLoading && <p className="text-sm text-gray-500 mt-2">Processing your request...</p>}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-4">
                    <p>Upgrade to **Wow++** tier to unlock Natural Language Queries.</p>
                </div>
            )}
        </div>
    );
};

export default NLPQueryInput;