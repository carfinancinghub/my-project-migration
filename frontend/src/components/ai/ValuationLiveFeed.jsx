import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ValuationDisplay from '@components/common/ValuationDisplay';
import PredictionEngine from '@services/ai/PredictionEngine';
import LiveUpdates from '@services/websocket/LiveUpdates';
import logger from '@utils/logger';

// 👑 Crown Certified Component
// Path: frontend/src/components/ai/ValuationLiveFeed.jsx
// Purpose: Real-time dashboard for vehicle valuation updates, enhancing bidding decisions
// Author: Rivers Auction Team
// Date: May 17, 2025
// Cod2 Crown Certified

const ValuationLiveFeed = ({ auctionId, userRole, isPremium }) => {
  const [valuations, setValuations] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = LiveUpdates.connect('/ws/predictions/live-updates');
    
    socket.on('valuationUpdate', (data) => {
      if (data.auctionId === auctionId) {
        setValuations((prev) => [...prev, data.valuation].slice(-50)); // Keep last 50 updates
        if (isPremium && isAnomaly(data.valuation)) {
          setAnomalies((prev) => [...prev, { ...data, timestamp: Date.now() }].slice(-10));
        }
      }
    });

    socket.on('error', (err) => {
      logger.error(`WebSocket error for auction ${auctionId}: ${err.message}`);
      setError('Failed to fetch live updates');
    });

    fetchInitialValuations();

    return () => socket.disconnect();
  }, [auctionId, isPremium]);

  const fetchInitialValuations = async () => {
    try {
      const response = await PredictionEngine.getValuationHistory(auctionId);
      setValuations(response.data.slice(-50)); // Initial 50 valuations
      if (isPremium) {
        const anomalies = response.data.filter(isAnomaly).map((val) => ({
          ...val,
          timestamp: Date.now(),
        }));
        setAnomalies(anomalies.slice(-10));
      }
    } catch (err) {
      logger.error(`Failed to fetch initial valuations for auction ${auctionId}: ${err.message}`);
      setError('Unable to load valuation history');
    }
  };

  const isAnomaly = (valuation) => {
    const mean = valuations.reduce((sum, val) => sum + val.price, 0) / valuations.length;
    return Math.abs(valuation.price - mean) > 0.3 * mean; // Flag >30% deviation
  };

  return (
    <div className="valuation-live-feed">
      <ValuationDisplay
        valuations={valuations}
        role={userRole}
        error={error}
      />
      {isPremium && (
        <>
          <div className="anomaly-alerts">
            {anomalies.map((anomaly, index) => (
              <div key={index} className="alert">
                Anomaly: {anomaly.price} at {new Date(anomaly.timestamp).toLocaleTimeString()}
              </div>
            ))}
          </div>
          <div className="auction-history-heatmap">
            {/* Premium heatmap visualization */}
            <canvas id="heatmap" />
          </div>
        </>
      )}
    </div>
  );
};

ValuationLiveFeed.propTypes = {
  auctionId: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default ValuationLiveFeed;