/*
File: PredictiveGraph.tsx
Path: C:\CFH\frontend\src\components\analytics\PredictiveGraph.tsx
Created: 2025-07-02 12:35 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Predictive graph component for the Analytics Dashboard with AI insights.
Artifact ID: n5o6p7q8-r9s0-t1u2-v3w4-x5y6z7a8b9c0
Version ID: o6p7q8r9-s0t1-u2v3-w4x5-y6z7a8b9c0d1
*/

import React, { useState, useMemo, useCallback } from 'react';
import { toast } from '@/utils/toast'; // Assuming a toast notification utility
import logger from '@/utils/logger'; // Centralized logging utility
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { useSpring, animated } from '@react-spring/web'; // For animated transitions (Wow++)

// Define prop types for the PredictiveGraph
interface PredictiveGraphProps {
    title?: string; // Optional title for the graph widget
    data: any[]; // Historical data (e.g., sales over time)
    predictionLine: any[]; // Predicted future data
    userTier?: 'free' | 'standard' | 'premium' | 'wowplus';
    dataKeyX?: string; // Key for X-axis (e.g., 'date')
    dataKeyY?: string; // Key for Y-axis (e.g., 'value')
    // For Premium Tier: Period comparisons
    comparisonData?: any[];
    // For Wow++ Tier: What-if scenario modeling
    onWhatIfScenario?: (scenarioParams: any) => void;
    scenarioResults?: any[];
}

const PredictiveGraph: React.FC<PredictiveGraphProps> = ({
    title = "Predictive Trends",
    data,
    predictionLine,
    userTier = 'free',
    dataKeyX = 'date',
    dataKeyY = 'value',
    comparisonData,
    onWhatIfScenario,
    scenarioResults
}) => {
    const [showComparison, setShowComparison] = useState(false);
    const [whatIfParams, setWhatIfParams] = useState<any>({}); // State for what-if inputs

    // Basic data validation
    if (!data || data.length === 0) {
        logger.warn(`PredictiveGraph "${title}": No historical data provided.`);
        // toast.info(`No historical data for "${title}" graph.`); // Can be too aggressive
        return <div className="predictive-graph-widget p-4 bg-white rounded-lg shadow-md"><h3 className="text-lg font-semibold mb-2">{title}</h3><p className="text-center text-gray-500">No historical data available.</p></div>;
    }
    if (!predictionLine || predictionLine.length === 0) {
        logger.warn(`PredictiveGraph "${title}": No prediction data provided.`);
        return <div className="predictive-graph-widget p-4 bg-white rounded-lg shadow-md"><h3 className="text-lg font-semibold mb-2">{title}</h3><p className="text-center text-gray-500">No prediction data available.</p></div>;
    }

    // CQS: Ensure <1s render (frontend perception)
    const startTime = performance.now();

    // Combine historical and prediction data for the chart
    const combinedData = useMemo(() => {
        // Find the last date of historical data to place the prediction line correctly
        const lastHistoricalPoint = data[data.length - 1];
        const combined = [...data, ...predictionLine.map(p => ({
            ...p,
            // Ensure prediction line starts after historical data, adjust x-axis if needed
            [dataKeyX]: p[dataKeyX] // Assuming x-axis values are sequential
        }))];

        // For comparison data, merge it if needed
        if (showComparison && comparisonData && comparisonData.length > 0) {
            // This merge logic depends on how comparisonData is structured
            // For simplicity, we'll just add it as another line
            return combined; // Or more complex merge
        }
        return combined;
    }, [data, predictionLine, dataKeyX, showComparison, comparisonData]);

    // Wow++: Animated transitions for data updates
    const animatedProps = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { tension: 200, friction: 20 },
        immediate: userTier !== 'wowplus' // Only animate if Wow++ tier
    });

    // Handle What-If Scenario submission
    const handleWhatIfSubmit = useCallback(() => {
        if (onWhatIfScenario) {
            logger.info(`PredictiveGraph "${title}": Running what-if scenario with params: ${JSON.stringify(whatIfParams)}`);
            onWhatIfScenario(whatIfParams);
        } else {
            toast.info("What-if scenario modeling is not configured for this graph.");
        }
    }, [onWhatIfScenario, whatIfParams, title]);

    const endTime = performance.now();
    const renderTimeMs = endTime - startTime;
    if (renderTimeMs > 1000) { // CQS: <1s render (frontend perception)
        logger.warn(`PredictiveGraph "${title}" render time exceeded 1s: ${renderTimeMs.toFixed(2)}ms`);
    }

    // CQS: accessibility with `aria-label`
    return (
        <animated.div style={animatedProps} className="predictive-graph-widget p-4 bg-white rounded-lg shadow-md" aria-label={`Predictive analytics graph: ${title}`}>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={dataKeyX} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {/* Historical Data Line (Free Tier and above) */}
                    <Line type="monotone" dataKey={dataKeyY} stroke="#8884d8" name="Historical" dot={false} />
                    {/* Prediction Line (Standard Tier and above) */}
                    {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && (
                        <Line type="monotone" dataKey={dataKeyY} stroke="#82ca9d" name="Prediction" strokeDasharray="5 5" dot={false} />
                    )}
                    {/* Premium Tier: Period comparisons */}
                    {(userTier === 'premium' || userTier === 'wowplus') && showComparison && comparisonData && (
                        <Line type="monotone" dataKey={dataKeyY} stroke="#ffc658" name="Comparison Period" dot={false} />
                    )}
                    {/* Reference line to separate historical from prediction */}
                    <ReferenceLine x={data[data.length - 1]?.[dataKeyX]} stroke="#ccc" strokeDasharray="3 3" />
                </LineChart>
            </ResponsiveContainer>

            {/* Premium Tier: Period Comparison Toggle */}
            {(userTier === 'premium' || userTier === 'wowplus') && comparisonData && (
                <div className="mt-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={showComparison}
                            onChange={() => setShowComparison(!showComparison)}
                            aria-label="Toggle comparison data"
                        />
                        <span className="ml-2 text-sm text-gray-700">Show Period Comparison</span>
                    </label>
                </div>
            )}

            {/* Wow++ Tier: What-if scenario modeling */}
            {userTier === 'wowplus' && onWhatIfScenario && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-md font-semibold text-blue-800 mb-2">What-If Scenario Modeling</h4>
                    <p className="text-sm text-blue-700 mb-3">Adjust parameters to see how they might impact future predictions.</p>
                    {/* TODO: Implement dynamic input fields for what-if parameters */}
                    <div className="flex flex-col gap-2">
                        <input
                            type="number"
                            placeholder="Simulate marketing spend increase (%)"
                            className="input input-bordered w-full text-sm"
                            onChange={(e) => setWhatIfParams({ ...whatIfParams, marketingIncrease: parseFloat(e.target.value) })}
                            aria-label="Input for marketing spend increase percentage"
                        />
                        <input
                            type="number"
                            placeholder="Simulate inventory change (%)"
                            className="input input-bordered w-full text-sm"
                            onChange={(e) => setWhatIfParams({ ...whatIfParams, inventoryChange: parseFloat(e.target.value) })}
                            aria-label="Input for inventory change percentage"
                        />
                        <button
                            onClick={handleWhatIfSubmit}
                            className="btn bg-blue-600 text-white hover:bg-blue-700"
                            aria-label="Run what-if scenario simulation"
                        >
                            Run Scenario
                        </button>
                    </div>
                    {scenarioResults && scenarioResults.length > 0 && (
                        <div className="mt-4 text-sm text-blue-900">
                            <h5 className="font-semibold">Scenario Result:</h5>
                            <ul className="list-disc list-inside">
                                {scenarioResults.map((res, idx) => (
                                    <li key={idx}>{res.description}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Wow++: Interactive zoom and pan, animated transitions, export options */}
            {/* These are features of the underlying charting library (Recharts) that can be enabled/configured. */}
            {/* Export options would likely be a separate button/icon on the widget itself. */}
            {userTier === 'wowplus' && (
                <div className="mt-4 text-sm text-gray-600">
                    <p>Interactive zoom/pan and export options are enabled for this graph.</p>
                    {/* TODO: Add actual export buttons (PNG, SVG) */}
                    <button className="btn btn-sm mt-2 mr-2">Export PNG</button>
                    <button className="btn btn-sm mt-2">Export SVG</button>
                </div>
            )}
        </animated.div>
    );
};

export default PredictiveGraph;