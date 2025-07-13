/**
 * File: MarketplaceInsightsDashboardGrokOld.jsx
 * Path: frontend/src/components/marketplace/MarketplaceInsightsDashboard.jsx
 * Author: Mini
 * Purpose: Enhance the insights dashboard with real-time notifications and CSV export.
 * Free Version (Core, Crown Certified): Display basic stats, error handling.
 * Premium Features (Monetizable, Pro/Enterprise tier): AI insights, visualizations, PDF export, real-time alerts, CSV export.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    FilePdf,
    FileCsv,
    AlertTriangle,
    Loader2,
    Zap
} from 'recharts';
import { Button } from '@/components/common/Button';
import { PremiumFeature } from '@/components/common/PremiumFeature'; // Assuming this exists
import { useWebSocket } from '@/lib/websocket'; // Assuming this exists
import { logger } from '@/utils/logger'; // Assuming this exists
import { cn } from '@/lib/utils'; // Assuming this exists
import { toast } from 'sonner'; // Assuming this exists, for notifications

// Import subcomponents
import BestFinancingDealCard from './BestFinancingDealCard.jsx';
import HaulerSummaryCard from './HaulerSummaryCard.jsx';
import BadgeDisplayPanel from './BadgeDisplayPanel.jsx';
import ActivityOverview from './ActivityOverview.jsx';

// Import PDF and CSV export utilities
import { exportLenderInsightsToPdf, exportInsightsToCsv } from '@/utils/lenderExportUtils.js';

// Mock API endpoint (replace with your actual API endpoint)
const API_ENDPOINT = '/api/insights';

// Mock data (for development when API is not available)
const mockInsightsData = {
    totalAuctions: 125,
    totalSpent: 75000,
    spendingTrends: [
        { month: 'Jan', amount: 5000 },
        { month: 'Feb', amount: 6500 },
        { month: 'Mar', amount: 8000 },
        { month: 'Apr', amount: 7000 },
        { month: 'May', amount: 9000 },
        { month: 'Jun', amount: 10000 },
    ],
    serviceUsage: [
        { name: 'Auction Bids', value: 400 },
        { name: 'Financing Deals', value: 150 },
        { name: 'Hauler Hires', value: 50 },
    ],
    bestFinancingDeal: {
        lender: 'Lender A',
        savings: 500,
    },
    haulerSummary: {
        haulerName: 'Hauler A',
        hires: 3,
    },
    badges: ['Gold Marketplace Member', 'Top Bidder'],
    newFinancingDeal: {
        lender: 'Lender B',
        amount: 1000,
        rate: 5.5
    }
};

// Chart colors
const spendingTrendColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#8884d8'];
const serviceUsageColors = ['#1a52e4', '#4472ca', '#6296c7'];

// Main Dashboard Component
const MarketplaceInsightsDashboard = () => {
    const [insights, setInsights] = useState<any | null>(null); // Use 'any' to avoid defining a complex type
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userId = 'user123'; // Replace with actual user ID from context
    const { sendMessage, latestMessage } = useWebSocket('ws://localhost:8080'); // Replace with your WebSocket URL

    // Fetch insights data
    useEffect(() => {
        const fetchInsights = async () => {
            try {
                // Simulate API call with a delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                // const response = await fetch(`${API_ENDPOINT}/${userId}`);
                // if (!response.ok) {
                //   throw new Error(`Failed to fetch insights: ${response.status}`);
                // }
                // const data = await response.json();
                // setInsights(data);

                // Use mock data for now
                setInsights(mockInsightsData);

            } catch (err: any) {
                const errorMessage = `Error fetching marketplace insights: ${err.message}`;
                setError(errorMessage);
                logger.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [userId]);

    // Handle PDF export
    const handleExportPdf = () => {
        if (insights) {
            exportLenderInsightsToPdf(insights);
        }
    };

    // Handle CSV export
    const handleExportCsv = () => {
        if (insights) {
            exportInsightsToCsv(insights);
        }
    };

    // Handle WebSocket message sending (for demonstration)
    useEffect(() => {
        if (latestMessage) {
            logger.info(`Received WebSocket message: ${latestMessage}`);
            // In a real application, you would update the UI based on the message.
            // For example:
            if (latestMessage.includes('financing deal')) {
                // Show toast notification
                toast.success(latestMessage, {
                    duration: 8000,
                    style: {
                        background: 'hsl(var(--muted))',
                        color: 'hsl(var(--muted-foreground))',
                    },
                    action: {
                        label: 'View',
                        onClick: () => {
                            //  handle navigation
                            console.log("Navigating to deals page");
                        },
                    },
                });

                setInsights(prevInsights => ({
                    ...prevInsights,
                    newFinancingDeal: {
                        lender: 'Lender C',
                        amount: 1200,
                        rate: 5.0
                    }
                }));
            }
        }
    }, [latestMessage]);

    // Send a mock WebSocket message after component mounts (for demonstration)
    useEffect(() => {
        setTimeout(() => {
            sendMessage('New financing deal available: 0.5% lower rate!');
        }, 5000);
    }, [sendMessage]);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <AlertTriangle className="absolute top-4 left-4 w-6 h-6" />
            </div>
        );
    }

    if (!insights) {
        return <div className="text-gray-500">No insights data available.</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="container mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-900">Marketplace Insights Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Activity Overview Card (Free Feature) */}
                    <ActivityOverview
                        totalAuctions={insights.totalAuctions}
                        totalSpent={insights.totalSpent}
                    />

                    {/* Best Financing Deal Card (Premium Feature) */}
                    <PremiumFeature feature="marketplaceInsights">
                        <BestFinancingDealCard deal={insights.bestFinancingDeal} />
                    </PremiumFeature>

                    {/* Hauler Summary Card (Premium Feature) */}
                    <PremiumFeature feature="marketplaceInsights">
                        <HaulerSummaryCard summary={insights.haulerSummary} />
                    </PremiumFeature>

                    {/* Badge Display Panel (Free Feature) */}
                    <BadgeDisplayPanel badges={insights.badges} />
                </div>

                {/* Spending Trends Chart (Premium Feature) */}
                <PremiumFeature feature="marketplaceInsights">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Spending Trends</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={insights.spendingTrends}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <AnimatePresence>
                                    {insights.spendingTrends.map((entry, index) => (
                                        <motion.div
                                            key={`bar-${entry.month}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Bar dataKey="amount" fill={spendingTrendColors[index % spendingTrendColors.length]} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </PremiumFeature>

                {/* Service Usage Chart (Premium Feature) */}
                <PremiumFeature feature="marketplaceInsights">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Usage</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={insights.serviceUsage}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({
                                        cx,
                                        cy,
                                        midAngle,
                                        innerRadius,
                                        outerRadius,
                                        value,
                                        index
                                    }) => {
                                        const RADIAN = Math.PI / 180;
                                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                        return (
                                            <text
                                                x={x}
                                                y={y}
                                                fill={serviceUsageColors[index % serviceUsageColors.length]}
                                                textAnchor={x > cx ? "start" : "end"}
                                                dominantBaseline="central"
                                            >
                                                {insights.serviceUsage[index].name} ({value})
                                            </text>
                                        );
                                    }}
                                >
                                    {insights.serviceUsage.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={serviceUsageColors[index % serviceUsageColors.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </PremiumFeature>

                {/* Export Buttons (PDF and CSV) - CSV gated for Pro/Enterprise */}
                <div className="flex justify-end gap-4">
                    <Button
                        onClick={handleExportPdf}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                        <FilePdf className="mr-2" />
                        Export to PDF
                    </Button>
                    <PremiumFeature feature="marketplaceInsights">
                        <Button
                            onClick={handleExportCsv}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                        >
                            <FileCsv className="mr-2" />
                            Download as CSV
                        </Button>
                    </PremiumFeature>
                </div>

                {/* New Financing Deal Alert (Real-time WebSocket) */}
                {insights.newFinancingDeal && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center"
                        role="alert"
                    >
                        <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                        <strong className="font-bold">New Financing Deal! </strong>
                        <span className="block sm:inline">
                            Lender {insights.newFinancingDeal.lender} is offering a deal at {insights.newFinancingDeal.rate}% for ${insights.newFinancingDeal.amount}.
                        </span>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MarketplaceInsightsDashboard;

