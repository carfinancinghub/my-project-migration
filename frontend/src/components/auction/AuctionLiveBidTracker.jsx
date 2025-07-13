// File: AuctionLiveBidTracker.jsx
// Path: C:\CFH\frontend\src\components\auction\AuctionLiveBidTracker.jsx
// Purpose: Display live bid updates for auctions (Updated for WebSocket)
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/auction

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getAuctionDetails } from '@services/api/auction';

const AuctionLiveBidTracker = ({ auctionId }) => {
  const [bids, setBids] = useState([]);
  const [currentBid, setCurrentBid] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialBids = async () => {
      try {
        const auction = await getAuctionDetails(auctionId);
        setBids(auction.bids || []);
        setCurrentBid(auction.currentBid || 0);
        logger.info(`[AuctionLiveBidTracker] Fetched initial bids for auctionId: ${auctionId}`);
      } catch (err) {
        logger.error(`[AuctionLiveBidTracker] Failed to fetch initial bids for auctionId ${auctionId}: ${err.message}`, err);
        setError('Failed to load bids. Please try again.');
      }
    };
    fetchInitialBids();

    const ws = new WebSocket(`ws://api.riversauction.com/bids/${auctionId}`);
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setBids(prev => [...prev, update]);
      setCurrentBid(update.amount);
      logger.info(`[AuctionLiveBidTracker] Received bid update for auctionId: ${auctionId}`);
    };
    ws.onerror = (err) => {
      logger.error(`[AuctionLiveBidTracker] WebSocket error for auctionId ${auctionId}: ${err.message}`, err);
      setError('Failed to connect to live bid updates.');
    };
    return () => ws.close();
  }, [auctionId]);

  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Live Bid Tracker</h3>
      <p className="text-gray-600 mb-2">Current Bid: <span className="font-medium text-gray-800">${currentBid}</span></p>
      <div className="h-40 overflow-y-auto">
        {bids.length > 0 ? (
          bids.map((bid, index) => (
            <p key={index} className="text-gray-600">
              Bid: ${bid.amount} by User {bid.bidderId} at {new Date(bid.timestamp).toLocaleTimeString()}
            </p>
          ))
        ) : (
          <p className="text-gray-500">No bids yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

AuctionLiveBidTracker.propTypes = {
  auctionId: PropTypes.string.isRequired
};

export default AuctionLiveBidTracker;