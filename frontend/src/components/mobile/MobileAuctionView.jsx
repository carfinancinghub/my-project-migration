// File: MobileAuctionView.jsx
// Path: C:\CFH\frontend\src\components\mobile\MobileAuctionView.jsx
// Purpose: Display mobile-optimized auction view
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/auction

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getAuctionDetails } from '@services/api/auction';

const MobileAuctionView = ({ auctionId }) => {
  const [auction, setAuction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuction = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAuctionDetails(auctionId);
        setAuction(data);
        logger.info(`[MobileAuctionView] Fetched auction details for auctionId: ${auctionId}`);
      } catch (err) {
        logger.error(`[MobileAuctionView] Failed to fetch auction details for auctionId ${auctionId}: ${err.message}`, err);
        setError('Failed to load auction details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuction();
  }, [auctionId]);

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading auction...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;
  if (!auction) return <div className="p-4 text-center text-gray-500">Auction not found.</div>;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{auction.title}</h2>
      <div className="flex flex-col space-y-2">
        <img src={auction.images[0] || 'placeholder.jpg'} alt={auction.title} className="w-full h-40 object-cover rounded-md" />
        <p className="text-sm text-gray-600">Current Bid: <span className="font-medium text-gray-800">${auction.currentBid}</span></p>
        <p className="text-sm text-gray-600">Time Remaining: <span className="font-medium text-gray-800">{auction.timeRemaining}</span></p>
        <p className="text-sm text-gray-600">Bidders: <span className="font-medium text-gray-800">{auction.bidderCount}</span></p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mt-2"
          onClick={() => logger.info(`[MobileAuctionView] User navigated to bid on auctionId: ${auctionId}`)}
        >
          Place Bid
        </button>
      </div>
    </div>
  );
};

MobileAuctionView.propTypes = {
  auctionId: PropTypes.string.isRequired
};

export default MobileAuctionView;