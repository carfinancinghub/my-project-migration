```
// 👑 Crown Certified Component — BidConfidenceMeter.jsx
// Path: frontend/src/components/ai/BidConfidenceMeter.jsx
// Purpose: Displays a confidence meter for bid success probability, with premium insights and advice.
// Author: Rivers Auction Team — May 17, 2025

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api } from '@services/api';
import logger from '@utils/logger';
import { PremiumGate } from '@components/common';
import { Gauge } from 'lucide-react';

const BidConfidenceMeter = ({ auctionId, bidAmount, isPremium }) => {
  const [confidence, setConfidence] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConfidence();
  }, [auctionId, bidAmount]);

  const fetchConfidence = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/predictions/basic', {
        params: { auctionId, bidAmount },
      });
      setConfidence(response.data.data.prediction.successProbability);
      setError(null);
    } catch (err) {
      logger.error(`Failed to fetch confidence for auction ${auctionId}`, err);
      setError(err.response?.data?.message || 'Unable to load confidence data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/predictions/recommendation', {
        params: { auctionId, bidAmount },
      });
      setAdvice(response.data.data.recommendation.message);
      setError(null);
    } catch (err) {
      logger.error(`Failed to fetch advice for auction ${auctionId}`, err);
      setError(err.response?.data?.message || 'Unable to load advice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bid-confidence-meter">
      <h3>Bid Confidence Meter</h3>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}
      {confidence && (
        <div className="confidence">
          <Gauge className="confidence-icon" />
          <p><strong>Confidence Score:</strong> {(confidence * 100).toFixed(1)}%</p>
        </div>
      )}
      <PremiumGate isPremium={isPremium} message="Bidding advice requires premium access">
        <div className="advice">
          <button
            onClick={fetchAdvice}
            disabled={loading}
            className="advice-button"
          >
            Load Bidding Advice
          </button>
          {advice && (
            <p><strong>Advice:</strong> {advice}</p>
          )}
        </div>
      </PremiumGate>
    </div>
  );
};

BidConfidenceMeter.propTypes = {
  auctionId: PropTypes.string.isRequired,
  bidAmount: PropTypes.number.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default BidConfidenceMeter;

/*
Functions Summary:
- BidConfidenceMeter
  - Purpose: User-facing component to display bid success confidence score and premium bidding advice
  - Inputs:
    - auctionId: string (required)
    - bidAmount: number (required)
    - isPremium: boolean (required)
  - Outputs: React component rendering confidence meter and advice panel
  - Features:
    - Displays confidence score via getBasicPrediction
    - Premium-gated bidding advice via getRecommendation
    - Error handling for API failures
  - Dependencies: react, prop-types, @services/api, @utils/logger, @components/common/PremiumGate, lucide-react
*/
```