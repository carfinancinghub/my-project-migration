// File: StorageInventoryTracker.jsx
// Path: frontend/src/components/storage/StorageInventoryTracker.jsx
// Purpose: UI to manage and optimize storage unit inventory with premium AR and badge tracking
// Author: Cod1 (05111359 - PDT)
// Editor: Cod2 (05111430 - PDT) – Added isPremium gating, badge tracker integration, logger fallback handling
// 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getOptimizedStorageLayout } from '@services/storage/StorageOptimizer';
import { getStorageGamificationStatus } from '@services/gamification/StorageBadgeTracker';

/**
 * Functions Summary:
 * - getOptimizedStorageLayout(items): AI layout suggestion for premium users.
 * - getStorageGamificationStatus(): Badge/milestone fetch for gamification.
 * Inputs: initialItems (array), isPremium (boolean)
 * Outputs: Optimized layout summary + badge list (if premium)
 * Dependencies: @services/storage/StorageOptimizer, @services/gamification/StorageBadgeTracker
 */
const StorageInventoryTracker = ({ initialItems, isPremium }) => {
  const [items, setItems] = useState(initialItems);
  const [optimizedLayout, setOptimizedLayout] = useState(null);
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isPremium) return;

    getOptimizedStorageLayout(items)
      .then(setOptimizedLayout)
      .catch(err => {
        logger.error('Failed to fetch optimized layout:', err);
        setError('Optimization failed.');
      });

    getStorageGamificationStatus()
      .then(setBadges)
      .catch(err => {
        logger.error('Failed to fetch gamification badges:', err);
      });
  }, [items, isPremium]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Storage Inventory Tracker</h2>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id}>
            {item.name} (Slot {item.slot})
          </li>
        ))}
      </ul>

      {isPremium ? (
        <>
          {optimizedLayout && (
            <div className="mt-4 text-green-700">
              Optimized Layout: {optimizedLayout.summary}
            </div>
          )}
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {badges.length > 0 && (
            <>
              <h3 className="text-sm font-semibold mt-4">Badge Progress</h3>
              <ul className="list-disc text-blue-700 text-sm ml-6">
                {badges.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <div className="text-gray-500 mt-4">
          Premium features locked. Upgrade to access optimization and badge insights.
        </div>
      )}
    </div>
  );
};

StorageInventoryTracker.propTypes = {
  initialItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slot: PropTypes.number.isRequired
    })
  ).isRequired,
  isPremium: PropTypes.bool.isRequired
};

export default StorageInventoryTracker;
