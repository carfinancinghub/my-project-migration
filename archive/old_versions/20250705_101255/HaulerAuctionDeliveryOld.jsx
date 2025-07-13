// File: HaulerAuctionDelivery.jsx
// Path: frontend/src/components/hauler/HaulerAuctionDelivery.jsx
// Purpose: Hauler dashboard to manage deliveries, route optimization, and blockchain POD submission
// Author: Cod1 (05111358 - PDT)
// 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { optimizeRoute } from '@services/route/RouteOptimizer';
import { verifyProofOfDelivery } from '@services/blockchain/BlockchainVerifier';

/**
 * Functions Summary:
 * - optimizeRoute(deliveryId): Fetches an optimized delivery route for the hauler (paid feature).
 * - verifyProofOfDelivery(deliveryId): Submits and verifies POD on blockchain (paid feature).
 * Inputs: deliveries (array of delivery objects)
 * Outputs: JSX view of hauler deliveries, route info, and blockchain verification status
 * Dependencies: @services/route/RouteOptimizer, @services/blockchain/BlockchainVerifier, logger
 */
const HaulerAuctionDelivery = ({ deliveries }) => {
  const [podStatus, setPodStatus] = useState({});
  const [routes, setRoutes] = useState({});
  const [errors, setErrors] = useState({});

  const handleMarkComplete = (deliveryId) => {
    setPodStatus((prev) => ({ ...prev, [deliveryId]: 'POD Submitted' }));
  };

  const handleOptimizeRoute = async (deliveryId) => {
    try {
      const route = await optimizeRoute(deliveryId);
      setRoutes((prev) => ({ ...prev, [deliveryId]: route }));
    } catch (err) {
      logger.error('Route optimization failed:', err);
      setErrors((prev) => ({ ...prev, [deliveryId]: 'Failed to optimize route' }));
    }
  };

  const handleBlockchainPOD = async (deliveryId) => {
    try {
      const verified = await verifyProofOfDelivery(deliveryId);
      setPodStatus((prev) => ({ ...prev, [deliveryId]: verified ? 'Verified' : 'Unverified' }));
    } catch (err) {
      logger.error('Blockchain POD verification failed:', err);
      setErrors((prev) => ({ ...prev, [deliveryId]: 'Blockchain verification failed' }));
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Hauler Delivery Dashboard</h2>
      <ul className="space-y-4">
        {deliveries.map((delivery) => (
          <li key={delivery.id} className="border-b pb-2">
            <div>Item: {delivery.item}</div>
            <div>Pickup: {delivery.pickup}</div>
            <div>Drop-off: {delivery.dropoff}</div>
            <div>Date: {delivery.date}</div>
            <div className="mt-2">
              <button
                className="bg-blue-600 text-white px-2 py-1 mt-2 mr-2"
                onClick={() => handleMarkComplete(delivery.id)}
              >
                Submit POD
              </button>
              <button
                className="bg-green-600 text-white px-2 py-1 mt-2 mr-2"
                onClick={() => handleOptimizeRoute(delivery.id)}
              >
                Optimize Route
              </button>
              <button
                className="bg-indigo-600 text-white px-2 py-1 mt-2"
                onClick={() => handleBlockchainPOD(delivery.id)}
              >
                Verify on Blockchain
              </button>
            </div>
            {routes[delivery.id] && (
              <div className="mt-2">Optimized Route: {routes[delivery.id]}</div>
            )}
            {podStatus[delivery.id] && (
              <div className="mt-2">Status: {podStatus[delivery.id]}</div>
            )}
            {errors[delivery.id] && (
              <div className="mt-2 text-red-600">Error: {errors[delivery.id]}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

HaulerAuctionDelivery.propTypes = {
  deliveries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      item: PropTypes.string.isRequired,
      pickup: PropTypes.string.isRequired,
      dropoff: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default HaulerAuctionDelivery;