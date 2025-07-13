// File: BuyerAnalyticsDashboardOld2.jsx
// Path: frontend/src/components/buyer/BuyerAnalyticsDashboard.jsx
// 👑 Cod1 Crown Certified — AI-Powered Buyer Insight Engine + Visual Simulator + Export Ready

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Button from '@components/common/Button';
import logger from '@utils/logger';
import html2pdf from 'html2pdf.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const BuyerAnalyticsDashboard = ({ buyerId }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/buyer/${buyerId}/analytics`);
        if (!response.ok) throw new Error('Failed to fetch analytics data');
        const data = await response.json();
        setAnalyticsData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        logger.error(`Analytics error for buyer ${buyerId}: ${err.message}`);
      }
    };
    fetchAnalytics();
  }, [buyerId]);

  const exportPDF = () => {
    const element = document.getElementById('buyer-analytics-container');
    html2pdf().from(element).save('BuyerAnalyticsDashboard.pdf');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" role="status">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  const bidSuccessData = {
    labels: analyticsData.bidHistory.map((bid) => bid.date),
    datasets: [
      {
        label: 'Bid Success Rate (%)',
        data: analyticsData.bidHistory.map((bid) => bid.successRate),
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const marketTrendData = {
    labels: analyticsData.marketTrends.map((trend) => trend.month),
    datasets: [
      {
        label: 'Avg Car Price ($)',
        data: analyticsData.marketTrends.map((trend) => trend.avgPrice),
        backgroundColor: 'rgba(96, 165, 250, 0.6)',
      },
    ],
  };

  const simulateOptimalBid = () => {
    const total = analyticsData.bidHistory.reduce((sum, bid) => sum + bid.successRate, 0);
    const average = (total / analyticsData.bidHistory.length).toFixed(2);
    alert(`📊 Cod1 Simulated Bid Suggestion: Try ${average - 2}% below market for best results.`);
  };

  return (
    <div
      id="buyer-analytics-container"
      className="bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto space-y-8"
    >
      <h2 className="text-2xl font-bold text-gray-800">Buyer Analytics Dashboard</h2>

      {/* Bid success rate line chart */}
      <section aria-labelledby="bid-success-title">
        <h3 id="bid-success-title" className="text-lg font-semibold text-gray-700 mb-2">
          🏁 Bid Success History
        </h3>
        <Line
          data={bidSuccessData}
          options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
        />
      </section>

      {/* Market trend bar chart */}
      <section aria-labelledby="market-trends-title">
        <h3 id="market-trends-title" className="text-lg font-semibold text-gray-700 mb-2">
          📈 Market Trends
        </h3>
        <Bar
          data={marketTrendData}
          options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
        />
      </section>

      {/* Savings */}
      <div className="text-green-600 font-bold text-lg">
        You’ve saved ${analyticsData.totalSaved.toLocaleString()} via smart bidding!
      </div>

      {/* Smart action buttons */}
      <div className="flex flex-wrap gap-4">
        <Button className="bg-green-500 text-white hover:bg-green-600" onClick={simulateOptimalBid}>
          💡 Simulate Optimal Bid
        </Button>
        <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={exportPDF}>
          📄 Export to PDF
        </Button>
        <Button className="bg-gray-700 text-white hover:bg-black" onClick={() => window.location.reload()}>
          🔁 Refresh
        </Button>
      </div>
    </div>
  );
};

BuyerAnalyticsDashboard.propTypes = {
  buyerId: PropTypes.string.isRequired,
};

export default BuyerAnalyticsDashboard;
