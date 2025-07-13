// File: BadgeDisplay.jsx
// Path: C:\CFH\frontend\src\components\premium\BadgeDisplay.jsx
// Purpose: Display user badges for social gamification
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/premium

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getUserBadges } from '@services/api/premium';

const BadgeDisplay = ({ userId }) => {
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBadges = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userBadges = await getUserBadges(userId);
        setBadges(userBadges);
        logger.info(`[BadgeDisplay] Fetched badges for userId: ${userId}`);
      } catch (err) {
        logger.error(`[BadgeDisplay] Failed to fetch badges for userId ${userId}: ${err.message}`, err);
        setError('Failed to load badges. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBadges();
  }, [userId]);

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading badges...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Badges</h2>
      {badges.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <div key={index} className="bg-yellow-100 p-2 rounded-lg shadow flex items-center space-x-2">
              <span className="text-yellow-600">🏆</span>
              <span className="text-sm text-gray-700">{badge.type}</span>
              <span className="text-xs text-gray-500">({new Date(badge.awardedAt).toLocaleDateString()})</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No badges yet. Keep participating to earn some!</p>
      )}
    </div>
  );
};

BadgeDisplay.propTypes = {
  userId: PropTypes.string.isRequired
};

export default BadgeDisplay;