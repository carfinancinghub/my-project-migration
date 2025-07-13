// 👑 Crown Certified Component — ValuationAssistant.jsx
// Path: frontend/src/components/ai/ValuationAssistant.jsx
// Purpose: Display AI-driven valuation metrics and recommendations for buyers, sellers, and officers
// Author: Rivers Auction Team — May 17, 2025
// Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ValuationDisplay from '@/components/common/ValuationDisplay';
import PredictiveGraph from '@/components/common/PredictiveGraph';
import PredictionEngine from '@/services/ai/PredictionEngine';
import logger from '@/utils/logger';

const ValuationAssistant = ({ auctionId, isPremium }) => {
  const [valuation, setValuation] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchValuation = async () => {
    try {
      const basic = await PredictionEngine.getBasicPrediction({ auctionId });
      setValuation(basic);
      if (isPremium) {
        const rec = await PredictionEngine.getRecommendation({ auctionId, bidAmount: basic?.estimatedValue });
        setRecommendation(rec);
      }
    } catch (err) {
      logger.error('Error fetching valuation predictions', err);
      setError('❌ Unable to load valuation insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValuation();
  }, [auctionId, isPremium]);

  if (loading) return <p>⏳ Loading valuation insights...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">💰 Valuation Assistant</h2>
      {valuation && <ValuationDisplay data={valuation} />}

      {isPremium && recommendation && (
        <>
          <h3 className="mt-4 font-semibold text-lg">📈 Predictive Recommendations</h3>
          <PredictiveGraph data={recommendation?.trends || []} />
          {recommendation?.advice && (
            <p className="mt-2 text-blue-700 italic">🧠 AI Suggests: <strong>{recommendation.advice}</strong></p>
          )}
        </>
      )}
    </div>
  );
};

ValuationAssistant.propTypes = {
  auctionId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default ValuationAssistant;
