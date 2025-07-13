// 👑 Crown Certified Component — BidStrategyAdvisor.jsx
// Path: frontend/src/components/ai/BidStrategyAdvisor.jsx
// Purpose: Recommend bid timing, exit triggers, and confidence scores using AI
// Author: Rivers Auction Team — May 18, 2025
// Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PredictionEngine from '@services/ai/PredictionEngine';
import logger from '@utils/logger';
import { Gauge, AlertTriangle } from 'lucide-react';

const BidStrategyAdvisor = ({ auctionId, isPremium }) => {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStrategy = async () => {
    try {
      const base = await PredictionEngine.getBasicPrediction({ auctionId });
      let advanced = {};
      if (isPremium) {
        advanced = await PredictionEngine.getAdvancedPrediction({ auctionId, userId: 'auto' });
      }
      setStrategy({ ...base, ...advanced });
    } catch (err) {
      logger.error('Failed to fetch bid strategy', err);
      setError('Unable to load bid strategy');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategy();
  }, [auctionId, isPremium]);

  if (loading) return <p className="text-gray-600">⏳ Analyzing bid timing...</p>;
  if (error) return <p className="text-red-600">❌ {error}</p>;

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <Gauge className="inline-block w-5 h-5" />
        Bid Strategy Advisor
      </h2>
      <p className="mb-2">📌 Optimal Bid Window: <strong>{strategy.optimalBidTime || 'N/A'}</strong></p>
      <p className="mb-2">📈 Confidence Score: <strong>{strategy.successProbability}%</strong></p>

      {isPremium && (
        <>
          <p className="mt-4">🚪 <strong>Exit Trigger:</strong> {strategy.exitTrigger || 'No trigger available'}</p>
          <p className="text-blue-700 italic mt-1">🧠 AI says: {strategy.recommendation || 'Hold until next signal'}</p>
        </>
      )}

      {!isPremium && (
        <p className="text-sm text-gray-500 mt-4 flex items-center gap-1">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          Premium features (exit triggers, deep analysis) require upgrade.
        </p>
      )}
    </div>
  );
};

BidStrategyAdvisor.propTypes = {
  auctionId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default BidStrategyAdvisor;
