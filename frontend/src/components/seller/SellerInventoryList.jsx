// File: SellerInventoryList.jsx
// Path: C:\CFH\frontend\src\components\seller\SellerInventoryList.jsx
// Purpose: Display seller’s inventory list for auction management
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/inventory

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getInventory } from '@services/api/inventory';

const SellerInventoryList = ({ sellerId }) => {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getInventory(sellerId);
        setInventory(data);
        logger.info(`[SellerInventoryList] Fetched inventory for sellerId: ${sellerId}`);
      } catch (err) {
        logger.error(`[SellerInventoryList] Failed to fetch inventory for sellerId ${sellerId}: ${err.message}`, err);
        setError('Failed to load inventory. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, [sellerId]);

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading inventory...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;
  if (!inventory.length) return <div className="p-4 text-center text-gray-500">No inventory available.</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Your Inventory</h2>
      <ul className="space-y-4">
        {inventory.map((item) => (
          <li key={item.id} className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-700">{item.vehicleName}</h3>
            <p className="text-sm text-gray-600">VIN: {item.vin}</p>
            <p className="text-sm text-gray-600">Year: {item.year}</p>
            <p className="text-sm text-gray-600">Listed: {item.isListed ? 'Yes' : 'No'}</p>
            <p className="text-sm text-gray-600">Reserve Price: ${item.reservePrice}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

SellerInventoryList.propTypes = { sellerId: PropTypes.string.isRequired };
export default SellerInventoryList;