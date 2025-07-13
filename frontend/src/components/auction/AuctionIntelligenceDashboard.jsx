/**
 * File: AuctionIntelligenceDashboard.jsx
 * Path: frontend/src/components/auction/AuctionIntelligenceDashboard.jsx
 * Purpose: Auction analytics and AI-powered bidding insights dashboard for the CFH Auction role
 * Author: Cod2
 * Date: 2025-05-09
 * Updated: Added SEOHead, used AdminLayout, applied theme.js utilities, enhanced comments and accessibility, removed unused CSS import
 * Cod2 Crown Certified: Yes
 * Features:
 * - Displays bid trends (Line Chart) and win rates (Bar Chart) with timeframe and category filters
 * - Real-time updates every 15 seconds when the document is visible
 * - Premium feature: AI-predicted winning bids (aiAuctionInsights)
 * - Responsive layout with Chart.js visualizations and toast notifications
 * Functions:
 * - fetchAnalytics(): Fetches auction analytics data based on timeframe and category
 * - renderLineChart(): Renders a line chart for bid trends
 * - renderBarChart(): Renders a bar chart for win rates
 * Dependencies: ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Line, Bar, PremiumFeature, ToastManager, AdminLayout, SEOHead, theme
 */

// Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import PremiumFeature from '@components/common/PremiumFeature';
import ToastManager from '@components/common/ToastManager';
import AdminLayout from '@components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AuctionIntelligenceDashboard = ({ defaultTimeframe = 'last_7_days', defaultCategory = 'vehicles' }) => {
  // State Management
  const [analytics, setAnalytics] = useState(null);
  const [timeframe, setTimeframe] = useState(defaultTimeframe);
  const [category, setCategory] = useState(defaultCategory);
  const [loading, setLoading] = useState(false);

  // Fetch Auction Analytics Data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/auctions/analytics?timeframe=${timeframe}&category=${category}`);
      if (!res.ok) throw new Error('Failed to load auction analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      ToastManager.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Data on Mount and Every 15 Seconds if Document is Visible
  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(() => {
      if (!document.hidden) fetchAnalytics();
    }, 15000);
    return () => clearInterval(interval);
  }, [timeframe, category]);

  // Render Line Chart for Bid Trends
  const renderLineChart = () => (
    <Line
      data={analytics?.bidTrends || {}}
      options={{ responsive: true }}
      aria-label="Bid Trends Line Chart"
      role="img"
      data-testid="bid-trends-chart"
    />
  );

  // Render Bar Chart for Win Rates
  const renderBarChart = () => (
    <Bar
      data={analytics?.winRates || {}}
      options={{ responsive: true }}
      aria-label="Win Rate Bar Chart"
      role="img"
      data-testid="win-rate-chart"
    />
  );

  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="Auction Intelligence Dashboard - CFH Auction Platform" />
      <div className="bg-gray-100 min-h-screen p-6" aria-label="Auction Intelligence Dashboard" role="region">
        <div className="container mx-auto space-y-8">
          <div className="flex flex-wrap gap-4 mb-4">
            <select
              value={timeframe}
              onChange={e => setTimeframe(e.target.value)}
              className={`border border-gray-300 ${theme.borderRadius} ${theme.spacingSm} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Timeframe Filter"
              data-testid="timeframe-dropdown"
            >
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
            </select>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={`border border-gray-300 ${theme.borderRadius} ${theme.spacingSm} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Category Filter"
              data-testid="category-dropdown"
            >
              <option value="vehicles">Vehicles</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>

          {loading && <p className="text-gray-600" data-testid="loading-text">Loading auction analytics...</p>}
          {!loading && analytics && (
            <>
              <section className="bg-white rounded-lg shadow-md p-6">{renderLineChart()}</section>
              <section className="bg-white rounded-lg shadow-md p-6">{renderBarChart()}</section>
              <PremiumFeature flag="aiAuctionInsights">
                <section
                  className={`bg-white ${theme.borderRadius} ${theme.cardShadow} ${theme.spacingLg}`}
                  aria-label="AI Predictions Panel"
                  role="complementary"
                  data-testid="ai-predictions-panel"
                >
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Predicted Winning Bids (AI)</h3>
                  <ul className="space-y-1">
                    {analytics.predictedWinningBids?.map((bid, idx) => (
                      <li key={idx} className="text-gray-600">{`${bid.item}: $${bid.amount}`}</li>
                    ))}
                  </ul>
                </section>
              </PremiumFeature>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// Prop Type Validation
AuctionIntelligenceDashboard.propTypes = {
  defaultTimeframe: PropTypes.string,
  defaultCategory: PropTypes.string
};

export default AuctionIntelligenceDashboard;