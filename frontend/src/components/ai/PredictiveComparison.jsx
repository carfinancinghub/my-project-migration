import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ValuationDisplay from '@components/common/ValuationDisplay';
import PredictionEngine from '@services/ai/PredictionEngine';
import LiveUpdates from '@services/websocket/LiveUpdates';
import logger from '@utils/logger';

// 👑 Crown Certified Component
// Path: frontend/src/components/ai/PredictiveComparison.jsx
// Purpose: Enhance decision-making by comparing predicted vs. actual auction valuations
// Author: Rivers Auction Team
// Date: May 17, 2025
// Cod2 Crown Certified

const PredictiveComparison = ({ auctionId, isPremium }) => {
  const [predictedValuation, setPredictedValuation] = useState(null);
  const [actualValuation, setActualValuation] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [prediction, actual] = await Promise.all([
          PredictionEngine.getPredictedValuation(auctionId),
          PredictionEngine.getActualValuation(auctionId),
        ]);
        setPredictedValuation(prediction);
        setActualValuation(actual);
        if (isPremium) {
          const trends = await PredictionEngine.getMultiAuctionTrends(auctionId);
          setTrendData(trends.slice(-10)); // Last 10 auctions
        }
      } catch (err) {
        logger.error(`Error fetching valuation data for auction ${auctionId}: ${err.message}`);
        setError('Failed to load valuation data');
      }
    };

    fetchInitialData();

    const socket = LiveUpdates.connect('/ws/predictions/live-updates');
    socket.on('update', (data) => {
      if (data.auctionId === auctionId) {
        if (data.predictedValuation) setPredictedValuation(data.predictedValuation);
        if (data.actualValuation) setActualValuation(data.actualValuation);
        if (isPremium && data.trendData) setTrendData(data.trendData.slice(-10));
      }
    });

    socket.on('error', (err) => {
      logger.error(`WebSocket error for auction ${auctionId}: ${err.message}`);
      setError('Failed to fetch live updates');
    });

    return () => socket.disconnect();
  }, [auctionId, isPremium]);

  const handleFeedback = async (feedback) => {
    try {
      await PredictionEngine.submitFeedback(auctionId, feedback);
      logger.info(`Feedback submitted for auction ${auctionId}`);
    } catch (err) {
      logger.error(`Failed to submit feedback for auction ${auctionId}: ${err.message}`);
      setError('Failed to submit feedback');
    }
  };

  if (error) return <div className="error">{error}</div>;

  const discrepancy = actualValuation && predictedValuation 
    ? ((actualValuation.price - predictedValuation.price) / predictedValuation.price) * 100 
    : 0;

  return (
    <div className="predictive-comparison">
      <h2>Valuation Comparison</h2>
      {!predictedValuation || !actualValuation ? (
        <p>Loading valuation data...</p>
      ) : (
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Predicted Valuation</td>
                <td><ValuationDisplay value={predictedValuation.price} /></td>
              </tr>
              <tr>
                <td>Actual Valuation</td>
                <td><ValuationDisplay value={actualValuation.price} /></td>
              </tr>
              <tr>
                <td>Discrepancy</td>
                <td>
                  <ValuationDisplay value={discrepancy.toFixed(2)} unit="%" />
                  {Math.abs(discrepancy) > 10 && <span className="alert"> (Significant Deviation)</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {isPremium && trendData.length > 0 && (
        <div className="trend-analysis">
          <h3>Multi-Auction Trends</h3>
          <div className="trend-chart">
            {/* Simplified chart rendering */}
            {trendData.map((item) => (
              <div key={item.auctionId} className="trend-item">
                <p>Auction: {item.auctionId}</p>
                <p>Predicted: <ValuationDisplay value={item.predicted} /></p>
                <p>Actual: <ValuationDisplay value={item.actual} /></p>
                {Math.abs((item.actual - item.predicted) / item.predicted) * 100 > 10 && (
                  <p className="alert">Deviation > 10%</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {isPremium && (
        <div className="feedback-section">
          <h3>Feedback on Accuracy</h3>
          <button onClick={() => handleFeedback({ accurate: true })}>Accurate</button>
          <button onClick={() => handleFeedback({ accurate: false })}>Inaccurate</button>
        </div>
      )}
    </div>
  );
};

PredictiveComparison.propTypes = {
  auctionId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default PredictiveComparison;