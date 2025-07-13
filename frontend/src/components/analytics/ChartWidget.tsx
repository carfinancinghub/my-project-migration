/*
File: ChartWidget.tsx
Path: C:\CFH\frontend\src\components\analytics\ChartWidget.tsx
Created: 2025-07-02 12:25 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Chart widget component for the Analytics Dashboard with interactive types.
Artifact ID: j1k2l3m4-n5o6-p7q8-r9s0-t1u2v3w4x5y6
Version ID: k2l3m4n5-o6p7-q8r9-s0t1-u2v3w4x5y6z7
*/

import React from 'react';
import { toast } from '@/utils/toast'; // Assuming a toast notification utility
import logger from '@/utils/logger'; // Centralized logging utility
// Recharts imports - assuming these are installed and available
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { useSpring, animated } from '@react-spring/web'; // For animated transitions (Wow++)

// Define prop types for the ChartWidget
interface ChartWidgetProps {
    title: string;
    type: 'bar' | 'line' | 'pie' | 'scatter' | 'total'; // 'total' for simple number display
    data: any; // Can be number for 'total', or array for charts
    userTier?: 'free' | 'standard' | 'premium' | 'wowplus';
    // Additional props for specific chart types (e.g., dataKeys, colors)
    dataKeyX?: string; // For line/bar/scatter charts, the key for X-axis
    dataKeyY?: string; // For line/bar/scatter charts, the key for Y-axis
    pieDataKey?: string; // For pie charts, the key for value
    pieNameKey?: string; // For pie charts, the key for name
    colors?: string[]; // Custom colors for chart segments
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF69B4']; // Default colors

const ChartWidget: React.FC<ChartWidgetProps> = ({
    title,
    type,
    data,
    userTier = 'free', // Default to free if not provided
    dataKeyX,
    dataKeyY,
    pieDataKey,
    pieNameKey,
    colors = COLORS
}) => {
    // Basic data validation
    if (!data && type !== 'total') { // For 'total' type, data can be 0 or null
        logger.warn(`ChartWidget "${title}": No data provided for chart type "${type}".`);
        // toast.error(`No data available for "${title}" chart.`); // Might be too aggressive for just missing data
        return <div className="chart-widget p-4 bg-white rounded-lg shadow-md"><h3 className="text-lg font-semibold mb-2">{title}</h3><p className="text-center text-gray-500">No data available.</p></div>;
    }

    // CQS: Ensure <1s render (frontend perception)
    const startTime = performance.now();

    // Wow++: Animated transitions for data updates
    const animatedProps = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { tension: 200, friction: 20 },
        // Only animate if Wow++ tier and not initial load (could be optimized)
        immediate: userTier !== 'wowplus'
    });

    const renderChart = () => {
        switch (type) {
            case 'total': // Free Tier: Simple number display for metrics like total sales/bids
                return (
                    <div className="text-center py-8">
                        <p className="text-5xl font-bold text-blue-600" aria-label={`${title} total is ${data}`}>{data}</p>
                        <p className="text-gray-500 mt-2">{title}</p>
                    </div>
                );
            case 'bar': // Free Tier: Basic bar chart
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={Array.isArray(data) ? data : [{ name: title, value: data }]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={dataKeyX || "name"} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={dataKeyY || "value"} fill={colors[0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'line': // Standard Tier: Interactive line chart
                if (userTier === 'free') return <p className="text-center text-gray-500">Upgrade to Standard for Line Charts.</p>;
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={dataKeyX || "name"} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey={dataKeyY || "value"} stroke={colors[0]} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'pie': // Standard Tier: Interactive pie chart
                if (userTier === 'free') return <p className="text-center text-gray-500">Upgrade to Standard for Pie Charts.</p>;
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey={pieDataKey || "value"}
                                nameKey={pieNameKey || "name"}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            >
                                {data && data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );
            case 'scatter': // Premium Tier: Drill-down scatter chart
                if (userTier !== 'premium' && userTier !== 'wowplus') return <p className="text-center text-gray-500">Upgrade to Premium for Scatter Charts.</p>;
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid />
                            <XAxis type="number" dataKey={dataKeyX || "x"} name="X-Axis" />
                            <YAxis type="number" dataKey={dataKeyY || "y"} name="Y-Axis" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />
                            <Scatter name={title} data={data} fill={colors[0]} />
                        </ScatterChart>
                    </ResponsiveContainer>
                );
            default:
                logger.error(`ChartWidget: Invalid chart type specified: ${type}`);
                return <div className="text-center text-red-500">Error: Invalid chart type.</div>;
        }
    };

    const endTime = performance.now();
    const renderTimeMs = endTime - startTime;
    if (renderTimeMs > 1000) { // CQS: <1s render (frontend perception)
        logger.warn(`ChartWidget "${title}" render time exceeded 1s: ${renderTimeMs.toFixed(2)}ms`);
    }

    // CQS: accessibility with `aria-label`
    return (
        <animated.div style={animatedProps} className="chart-widget p-4 bg-white rounded-lg shadow-md" aria-label={`Analytics chart: ${title}`}>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {renderChart()}
        </animated.div>
    );
};

export default ChartWidget;