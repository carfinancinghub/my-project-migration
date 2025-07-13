/**
 * File: MarketplaceInsightsDashboardGrokOld(3).jsx
 * Path: frontend/src/components/marketplace/MarketplaceInsightsDashboard.jsx
 * Author: Mini
 * Purpose: Enhanced insights dashboard with real API data, PDF preview, and multi-language support.
 * Free Version (Core, Crown Certified): Display basic stats, error handling.
 * Premium Features (Monetizable, Pro/Enterprise tier): AI insights, visualizations, PDF export, real-time alerts, CSV export, PDF preview.
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
    Zap,
    Eye
} from 'recharts';
import { Button } from '@/components/common/Button';
import { PremiumFeature } from '@/components/common/PremiumFeature';
import { useWebSocket } from '@/lib/websocket';
import { logger } from '@/utils/logger';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useLanguage } from '@/components/common/MultiLanguageSupport'; // Multi-language support
import LanguageSelector from '@/components/common/LanguageSelector';    // Multi-language support

// Import subcomponents
import BestFinancingDealCard from './BestFinancingDealCard.jsx';
import HaulerSummaryCard from './HaulerSummaryCard.jsx';
import BadgeDisplayPanel from './BadgeDisplayPanel.jsx';
import ActivityOverview from './ActivityOverview.jsx';
import PDFPreviewModal from '@/components/common/PDFPreviewModal.jsx'; // Import the new modal component

// Import PDF and CSV export utilities
import { exportLenderInsightsToPdf, exportInsightsToCsv } from '@/utils/lenderExportUtils.js';

// Mock API endpoint (replace with your actual API endpoint)
const API_ENDPOINT = '/api/insights';

// Mock data (for development when API is not available)
const mockInsightsData = {
    auctions: 125,
    totalSpent: 75000,
    bestFinancingDeal: {
        lender: 'Lender A',
        savings: 500,
    },
    haulersHired: 3,
    badges: ['Gold Marketplace Member', 'Top Bidder'],
    loyaltyPoints: 2500,
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
    const [insights, setInsights] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userId = 'user123';
    const { sendMessage, latestMessage } = useWebSocket('ws://localhost:8080');
    const [pdfPreview, setPdfPreview] = useState<string | null>(null);
    const { getTranslation } = useLanguage(); // Use the translation hook

    // Function to fetch insights data from the API
    const fetchInsights = useCallback(async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            // Simulate API call with a delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            // const response = await fetch(`${API_ENDPOINT}/${userId}`);
            // if (!response.ok) {
            //   throw new Error(`Failed to fetch insights: ${response.status}`);
            // }
            // const data = await response.json();

            // Use mock data for now
            const data = mockInsightsData;
            setInsights({
                totalAuctions: data.auctions,
                totalSpent: data.totalSpent,
                bestFinancingDeal: data.bestFinancingDeal,
                haulersHired: data.haulersHired,
                badges: data.badges,
                loyaltyPoints: data.loyaltyPoints,
                spendingTrends: data.spendingTrends,
                serviceUsage: data.serviceUsage,
                newFinancingDeal: data.newFinancingDeal
            });

        } catch (err: any) {
            const errorMessage = `${getTranslation('errorFetchingInsights')}: ${err.message}`;
            setError(errorMessage);
            logger.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [getTranslation]);

    // Fetch insights data on component mount and when userId changes
    useEffect(() => {
        fetchInsights(userId);
    }, [userId, fetchInsights]);

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

    // Function to generate and preview PDF
    const handlePreviewPdf = () => {
        if (insights) {
            const pdfDataUri = exportLenderInsightsToPdf(insights, true);
            setPdfPreview(pdfDataUri);
        }
    };

    // Close PDF preview modal
    const closePdfPreview = () => {
        setPdfPreview(null);
    };

    // Handle WebSocket message sending
    useEffect(() => {
        if (latestMessage) {
            logger.info(`Received WebSocket message: ${latestMessage}`);
            if (latestMessage.includes('financing deal')) {
                toast.success(latestMessage, {
                    duration: 8000,
                    style: {
                        background: 'hsl(var(--muted))',
                        color: 'hsl(var(--muted-foreground))',
                    },
                    action: {
                        label: getTranslation('view'),
                        onClick: () => {
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
    }, [latestMessage, getTranslation]);

    // Send a mock WebSocket message after component mounts
    useEffect(() => {
        setTimeout(() => {
            sendMessage(getTranslation('newFinancingDealAvailable'));
        }, 5000);
    }, [sendMessage, getTranslation]);


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
                <strong className="font-bold">{getTranslation('error')}: </strong>
                <span className="block sm:inline">{error}</span>
                <AlertTriangle className="absolute top-4 left-4 w-6 h-6" />
            </div>
        );
    }

    if (!insights) {
        return <div className="text-gray-500">{getTranslation('noInsightsAvailable')}</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="container mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{getTranslation('marketplaceInsightsDashboard')}</h1>
                    <PremiumFeature feature="multiLanguage">
                        <LanguageSelector />
                    </PremiumFeature>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Activity Overview Card (Free Feature) */}
                    <ActivityOverview userId={userId} />

                    {/* Best Financing Deal Card (Premium Feature) */}
                    <PremiumFeature feature="marketplaceInsights">
                        <BestFinancingDealCard userId={userId} />
                    </PremiumFeature>

                    {/* Hauler Summary Card (Premium Feature) */}
                    <PremiumFeature feature="marketplaceInsights">
                        <HaulerSummaryCard region="west" />
                    </PremiumFeature>

                    {/* Badge Display Panel (Free Feature) */}
                    <BadgeDisplayPanel userId={userId} />
                </div>

                {/* Spending Trends Chart (Premium Feature) */}
                <PremiumFeature feature="marketplaceInsights">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">{getTranslation('spendingTrends')}</h2>
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
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">{getTranslation('serviceUsage')}</h2>
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
                    <PremiumFeature feature="marketplaceInsights">
                        <Button
                            onClick={handlePreviewPdf}
                            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
                        >
                            <Eye className="mr-2" />
                            {getTranslation('previewPDF')}
                        </Button>
                    </PremiumFeature>
                    <Button
                        onClick={handleExportPdf}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                        <FilePdf className="mr-2" />
                        {getTranslation('exportPDF')}
                    </Button>
                    <PremiumFeature feature="marketplaceInsights">
                        <Button
                            onClick={handleExportCsv}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                        >
                            <FileCsv className="mr-2" />
                            {getTranslation('downloadCSV')}
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
                        <strong className="font-bold">{getTranslation('newFinancingDeal')}! </strong>
                        <span className="block sm:inline">
                            {getTranslation('lender')} {insights.newFinancingDeal.lender} {getTranslation('isOfferingADeal')} {insights.newFinancingDeal.rate}% {getTranslation('for')} ${insights.newFinancingDeal.amount}.
                        </span>
                    </motion.div>
                )}

                {/* PDF Preview Modal */}
                <PDFPreviewModal pdfData={pdfPreview} onClose={closePdfPreview} title={getTranslation('pdfPreview')} />

            </div>
        </div>
    );
};

export default MarketplaceInsightsDashboard;

