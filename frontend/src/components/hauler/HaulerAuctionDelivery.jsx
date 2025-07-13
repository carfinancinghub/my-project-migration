// File: HaulerAuctionDelivery.jsx
// Path: C:\CFH\frontend\src\components\hauler\HaulerAuctionDelivery.jsx
// Purpose: Manage auction delivery updates for Hauler role (Updated for WebSocket)
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/hauler

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getDeliveryDetails } from '@services/api/hauler';

const HaulerAuctionDelivery = ({ haulerId, auctionId }) => {
  const [delivery, setDelivery] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const data = await getDeliveryDetails(haulerId, auctionId);
        setDelivery(data);
        logger.info(`[HaulerAuctionDelivery] Fetched delivery details for haulerId: ${haulerId}, auctionId: ${auctionId}`);
      } catch (err) {
        logger.error(`[HaulerAuctionDelivery] Failed to fetch delivery details for haulerId ${haulerId}: ${err.message}`, err);
        setError('Failed to load delivery details. Please try again.');
      }
    };
    fetchDeliveryDetails();

    const ws = new WebSocket(`ws://api.riversauction.com/delivery/${auctionId}`);
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setUpdates(prev => [...prev, update]);
      setDelivery(prev => ({ ...prev, status: update.status }));
      logger.info(`[HaulerAuctionDelivery] Received delivery update for haulerId: ${haulerId}, auctionId: ${auctionId}`);
    };
    ws.onerror = (err) => {
      logger.error(`[HaulerAuctionDelivery] WebSocket error for haulerId ${haulerId}: ${err.message}`, err);
      setError('Failed to connect to live delivery updates.');
    };
    return () => ws.close();
  }, [haulerId, auctionId]);

  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Auction Delivery Updates</h3>
      {delivery ? (
        <div className="space-y-2">
          <p className="text-gray-600">Auction ID: <span className="font-medium">{auctionId}</span></p>
          <p className="text-gray-600">Status: <span className="font-medium">{delivery.status || 'Pending'}</span></p>
          <div className="h-40 overflow-y-auto">
            {updates.map((update, index) => (
              <p key={index} className="text-gray-600">Update: {update.status} at {new Date(update.timestamp).toLocaleTimeString()}</p>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading delivery details...</p>
      )}
    </div>
  );
};

HaulerAuctionDelivery.propTypes = {
  haulerId: PropTypes.string.isRequired,
  auctionId: PropTypes.string.isRequired
};

export default HaulerAuctionDelivery;