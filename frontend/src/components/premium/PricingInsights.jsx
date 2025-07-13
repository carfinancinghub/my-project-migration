// File: PricingInsights.jsx
// Path: C:\CFH\frontend\src\components\premium\PricingInsights.jsx
// Purpose: Display real-time pricing insights for premium users (Updated for WebSocket)
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/premium

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getDynamicPrice } from '@services/api/premium';

const PricingInsights = ({ userId, auctionId }) => {
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialInsights = async () => {
      try {
        const data = await getDynamicPrice(userId, auctionId);
        setInsights(data);
        logger.info(`[PricingInsights] Fetched initial pricing insights for userId: ${userId}, auctionId: ${auctionId}`);
      } catch (err) {
        logger.error(`[PricingInsights] Failed to fetch initial pricing insights for userId ${userId}: ${err.message}`, err);
        setError('Failed to load pricing insights. Please try again.');
      }
    };
    fetchInitialInsights();

    const ws = new WebSocket(`ws://api.riversauction.com/price/${auctionId}`);
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setInsights(update);
      logger.info(`[PricingInsights] Received WebSocket update for userId: ${userId}, auctionId: ${auctionId}`);
    };
    ws.onerror = (err) => {
      logger.error(`[PricingInsights] WebSocket error for userId ${userId}: ${err.message}`, err);
      setError('Failed to connect to live pricing updates.');
    };
    return () => ws.close();
  }, [userId, auctionId]);

  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Dynamic Pricing Insights</h3>
      {insights ? (
        <div className="space-y-2">
          <p className="text-gray-600">
            Suggested Bid: <span className="font-medium text-gray-800">${insights.suggestedBid}</span>
          </p>
          <p className="text-gray-600">
            Confidence: <span className="font-medium text-gray-800">{(insights.confidence * 100).toFixed(1)}%</span>
          </p>
          <p className="text-gray-600">
            Market Trend: <span className={`font-medium ${insights.trend === 'increasing' ? 'text-green-600' : 'text-red-600'}`}>{insights.trend}</span>
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Connecting to live pricing...</p>
      )}
    </div>
  );
};

PricingInsights.propTypes = {
  userId: PropTypes.string.isRequired,
  auctionId: PropTypes.string.isRequired
};

export default PricingInsights;