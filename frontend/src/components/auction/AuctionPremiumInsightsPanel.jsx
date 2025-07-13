/**
 * File: AuctionPremiumInsightsPanel.jsx
 * Path: frontend/src/components/auction/AuctionPremiumInsightsPanel.jsx
 * Purpose: Premium-only AI trends and strategy suggestions for auctions
 * Author: Cod2 (05082148)
 * Date: May 08, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import PremiumFeature from '@components/common/PremiumFeature';
import logger from '@utils/logger';

ChartJS.register(LineElement, PointElement, Tooltip, Legend);

// --- Component Definition ---
const AuctionPremiumInsightsPanel = ({ auctionId }) => {
  // --- State Management ---
  const [trends, setTrends] = useState(null);
  const [suggestedTiming, setSuggestedTiming] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  // --- Auth & Caching ---
  const checkPremiumAuth = async () => {
    try {
      const response = await axios.get('/api/user/premium-status');
      setIsPremium(response.data.isPremium);
      return response.data.isPremium;
    } catch (error) {
      logError(error);
      return false;
    }
  };

  const cacheTrendData = (data) => {
    try {
      localStorage.setItem(`trendData_${auctionId}`, JSON.stringify(data));
    } catch (error) {
      logError(error);
    }
  };

  // --- AI Chart & Insights ---
  const renderAIPredictionTrends = () => {
    const chartData = {
      labels: trends?.labels || [],
      datasets: [
        {
          label: 'Confidence Score',
          data: trends?.scores || [],
          borderColor: '#34d399',
          tension: 0.4,
          fill: false,
        },
      ],
    };
    return (
      <div role="region" aria-label="AI Prediction Trends">
        <Line data={chartData} />
      </div>
    );
  };

  const getSuggestedBidTiming = async () => {
    try {
      const response = await axios.get(`/api/auction/${auctionId}/bid-timing`);
      setSuggestedTiming(response.data.timing);
      return response.data.timing;
    } catch (error) {
      logError(error);
      return 'Error fetching timing';
    }
  };

  const exportTrendSnapshot = () => {
    try {
      const canvas = document.querySelector('canvas');
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `trend-snapshot-${auctionId}.png`;
      link.click();
    } catch (error) {
      logError(error);
    }
  };

  // --- Logging & Accessibility ---
  const logError = (error) => {
    logger.error(`AuctionPremiumInsightsPanel Error: ${error.message}`);
  };

  const ensureAccessibility = () => {
    // ARIA handled via semantic roles + attributes in JSX
  };

  // --- Lifecycle ---
  useEffect(() => {
    const fetchData = async () => {
      const isPremiumUser = await checkPremiumAuth();
      if (isPremiumUser) {
        const cachedData = localStorage.getItem(`trendData_${auctionId}`);
        if (cachedData) {
          setTrends(JSON.parse(cachedData));
        } else {
          try {
            const response = await axios.get(`/api/auction/${auctionId}/trends`);
            setTrends(response.data);
            cacheTrendData(response.data);
          } catch (error) {
            logError(error);
          }
        }
        getSuggestedBidTiming();
      }
    };

    fetchData();
    ensureAccessibility();
  }, [auctionId]);

  // --- Main Render ---
  return (
    <PremiumFeature feature="premiumInsights">
      <div className="insights-panel">
        <h3>Premium Auction Insights</h3>
        {trends && renderAIPredictionTrends()}
        {suggestedTiming && (
          <p role="status" aria-live="polite">
            Suggested Bid Timing: {suggestedTiming}
          </p>
        )}
        <button onClick={exportTrendSnapshot} aria-label="Export trend snapshot as PNG">
          Export Trends
        </button>
      </div>
    </PremiumFeature>
  );
};

export default AuctionPremiumInsightsPanel;
