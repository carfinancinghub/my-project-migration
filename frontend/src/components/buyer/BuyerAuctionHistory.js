// File: BuyerAuctionHistory.js
// Path: frontend/src/components/buyer/BuyerAuctionHistory.js
// Purpose: Display buyer’s auction history with premium visual insights
// Author: Rivers Auction Team
// Editor: Cod1 (05141438 - PDT) — Created with analytics + premium gating
// 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { fetchBuyerAuctionHistory } from '@services/buyer/AuctionHistoryService';
import PremiumChart from '@components/common/PremiumChart';

/**
 * Functions Summary:
 * - fetchBuyerAuctionHistory(userId): Loads history from backend
 * - renderPremiumAnalytics(): Shows bid trend visual if isPremium
 * Inputs: userId, isPremium
 * Outputs: Buyer auction list with optional analytics
 * Dependencies: @services/buyer/AuctionHistoryService, @components/common/PremiumChart, @utils/logger
 */
const BuyerAuctionHistory = ({ userId, isPremium }) => {
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchBuyerAuctionHistory(userId, isPremium);
        setHistory(result.history);
        if (isPremium && result.analytics) {
          setAnalytics(result.analytics);
        }
      } catch (err) {
        logger.error('Failed to load buyer auction history:', err);
        setError('Could not fetch auction history.');
      }
    }

    if (userId) loadData();
  }, [userId, isPremium]);

  const renderPremiumAnalytics = () => {
    if (!isPremium) return <p className="text-sm text-gray-500">Premium analytics — upgrade to unlock.</p>;
    if (!analytics) return null;
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Your Bid Patterns</h3>
        <PremiumChart data={analytics} />
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Your Auction History</h2>
      {error && <div className="text-red-600">{error}</div>}
      <ul className="space-y-2">
        {history.map((entry) => (
          <li key={entry.auctionId} className="text-gray-800">
            {entry.date} — {entry.item} ({entry.status})
          </li>
        ))}
      </ul>
      {renderPremiumAnalytics()}
    </div>
  );
};

BuyerAuctionHistory.propTypes = {
  userId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default BuyerAuctionHistory;