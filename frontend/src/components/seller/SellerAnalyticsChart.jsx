// File: SellerAnalyticsChart.jsx
// Path: C:\CFH\frontend\src\components\seller\SellerAnalyticsChart.jsx
// Purpose: Visualize seller’s auction analytics with Chart.js
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/auction, chart.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getSellerAnalytics } from '@services/api/auction';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SellerAnalyticsChart = ({ sellerId }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSellerAnalytics(sellerId);
        const chartData = {
          labels: ['Total Auctions', 'Active Auctions', 'Total Revenue', 'Avg. Bid'],
          datasets: [
            {
              label: 'Analytics',
              data: [
                data.totalAuctions,
                data.activeAuctions,
                data.totalRevenue / 1000, // Scale down for chart
                data.avgBid / 1000 // Scale down for chart
              ],
              backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
              borderColor: ['#2563EB', '#059669', '#D97706', '#DC2626'],
              borderWidth: 1
            }
          ]
        };
        setChartData(chartData);
        logger.info(`[SellerAnalyticsChart] Fetched analytics for sellerId: ${sellerId}`);
      } catch (err) {
        logger.error(`[SellerAnalyticsChart] Failed to fetch analytics for sellerId ${sellerId}: ${err.message}`, err);
        setError('Failed to load analytics chart. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [sellerId]);

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading chart...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;
  if (!chartData) return <div className="p-4 text-center text-gray-500">No analytics data available.</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Analytics Chart</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Seller Auction Analytics' }
          }
        }}
      />
    </div>
  );
};

SellerAnalyticsChart.propTypes = { sellerId: PropTypes.string.isRequired };
export default SellerAnalyticsChart;