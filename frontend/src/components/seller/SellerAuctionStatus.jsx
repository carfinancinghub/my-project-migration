// File: SellerAuctionStatus.jsx
// Path: C:\CFH\frontend\src\components\seller\SellerAuctionStatus.jsx
// Purpose: Display seller’s auction status with real-time updates
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/auction

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getAuctionStatus } from '@services/api/auction';

const SellerAuctionStatus = ({ auctionId }) => {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAuctionStatus(auctionId);
        setStatus(data);
        logger.info(`[SellerAuctionStatus] Fetched status for auctionId: ${auctionId}`);
      } catch (err) {
        logger.error(`[SellerAuctionStatus] Failed to fetch status for auctionId ${auctionId}: ${err.message}`, err);
        setError('Failed to load auction status. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, [auctionId]);

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading auction status...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;
  if (!status) return <div className="p-4 text-center text-gray-500">No auction status available.</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-md mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Auction Status</h2>
      <div className="space-y-4">
        <p className="text-lg font-medium text-gray-700">Auction ID: {auctionId}</p>
        <p className="text-lg font-medium text-gray-700">Status: <span className={`text-${status.isActive ? 'green' : 'red'}-600`}>{status.isActive ? 'Active' : 'Closed'}</span></p>
        <p className="text-sm text-gray-600">Current Bid: ${status.currentBid}</p>
        <p className="text-sm text-gray-600">Bidders: {status.bidderCount}</p>
        <p className="text-sm text-gray-600">End Time: {status.endTime}</p>
      </div>
    </div>
  );
};

SellerAuctionStatus.propTypes = { auctionId: PropTypes.string.isRequired };
export default SellerAuctionStatus;