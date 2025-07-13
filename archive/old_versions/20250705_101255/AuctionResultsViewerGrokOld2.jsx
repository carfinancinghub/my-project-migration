// File: AuctionResultsViewer.jsx
// Path: frontend/src/components/buyer/AuctionResultsViewer.jsx
// Purpose: Visualize auction bid history with AI insights and premium analytics tools
// Author: Cod2
// Date: 2025-05-01
// 👑 Cod2 Crown Certified

// ─────────────────────────────────────────────────────────────
// 🔍 Function Index:
// - fetchData(): Loads bid history and AI bid insights.
// - renderChart(): Renders bid history using Chart.js.
// - handleExport(): Exports bid data and AI insights to PDF.
// - useEffect(() => ...): Initializes data and renders chart.
// - return JSX: Displays chart, premium AI predictions, and export button.
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { toast } from 'react-toastify';
import PremiumFeature from '@/components/common/PremiumFeature';
import { exportBidAnalyticsPDF } from '@/utils/analyticsExportUtils';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import logger from '@/utils/logger';

const AuctionResultsViewer = ({ auctionId, currentBid }) => {
  const [bids, setBids] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bidRes = await axios.get(`/api/auctions/${auctionId}/bids`);
        const aiRes = await axios.post('/api/ai/bid-predict', {
          auctionId,
          currentBid
        });
        setBids(bidRes.data);
        setAnalytics(aiRes.data);
      } catch (err) {
        logger.error('Error loading auction data', err);
        toast.error('Failed to load auction bid data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [auctionId, currentBid]);

  const renderChart = () => {
    const ctx = document.getElementById('bidChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: bids.map(b => new Date(b.timestamp).toLocaleString()),
        datasets: [
          {
            label: 'Bid Amount',
            data: bids.map(b => b.amount),
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.2,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 800,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  };

  useEffect(() => {
    if (bids.length > 0) renderChart();
  }, [bids]);

  const handleExport = async () => {
    try {
      setExporting(true);
      await exportBidAnalyticsPDF({ auctionId, bids, analytics });
      toast.success('PDF exported successfully');
    } catch (err) {
      logger.error('PDF export failed', err);
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800">Bid History & AI Insights</h2>
      <canvas id="bidChart" height="150" className="w-full"></canvas>

      <PremiumFeature feature="bidAnalytics">
        {analytics && (
          <div className="bg-blue-50 p-4 rounded-md text-sm">
            <p><strong>🧠 Success Probability:</strong> {Math.round(analytics.probability * 100)}%</p>
            <p><strong>📊 Tip:</strong> {analytics.message || analytics.strategyTip}</p>
            {analytics.suggestedBid && (
              <p><strong>💰 Suggested Bid:</strong> ${analytics.suggestedBid}</p>
            )}
          </div>
        )}

        <button
          onClick={handleExport}
          disabled={exporting}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50"
        >
          {exporting ? 'Exporting...' : 'Download Bid Report PDF'}
        </button>
      </PremiumFeature>
    </div>
  );
};

export default AuctionResultsViewer;
