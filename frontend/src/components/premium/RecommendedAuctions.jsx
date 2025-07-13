// File: RecommendedAuctions.jsx
// Path: C:\CFH\frontend\src\components\premium\RecommendedAuctions.jsx
// Purpose: Display personalized auction recommendations for premium users
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/premium

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getRecommendations } from '@services/api/premium';

const RecommendedAuctions = ({ userId }) => {
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const recommendedAuctions = await getRecommendations(userId);
        setAuctions(recommendedAuctions);
        logger.info(`[RecommendedAuctions] Fetched recommendations for userId: ${userId}`);
      } catch (err) {
        logger.error(`[RecommendedAuctions] Failed to fetch recommendations for userId ${userId}: ${err.message}`, err);
        setError('Failed to load recommendations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, [userId]);

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading recommendations...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Recommended Auctions</h3>
      {auctions.length > 0 ? (
        <div className="space-y-4">
          {auctions.map((auction, index) => (
            <div key={index} className="flex items-center space-x-4">
              <img src={auction.images[0] || 'placeholder.jpg'} alt={auction.title} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <h4 className="text-gray-800 font-medium">{auction.title}</h4>
                <p className="text-gray-600 text-sm">Current Bid: ${auction.currentBid}</p>
                <a href={`/auctions/${auction.id}`} className="text-blue-500 hover:underline text-sm">View Auction</a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recommendations available.</p>
      )}
    </div>
  );
};

RecommendedAuctions.propTypes = {
  userId: PropTypes.string.isRequired
};

export default RecommendedAuctions;