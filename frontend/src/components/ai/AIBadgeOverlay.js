// File: AIBadgeOverlay.js
// Path: frontend/src/components/ai/AIBadgeOverlay.js
// Purpose: Display AI-driven badge overlays for user achievements.
// Author: Rivers Auction Team
// Date: May 15, 2025
// 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Badge from '@components/common/Badge';
import { fetchUserBadgeStats } from '@services/ai/BadgeService';
import { getPremiumBadgeAnimation } from '@utils/animation';
import logger from '@utils/logger';

/**
 * Functions Summary:
 * - fetchUserBadgeStats(userId): Fetch badge stats from AI service (premium only)
 * - getPremiumBadgeAnimation(): Returns style object with glow/pulse effects
 * Inputs:
 * - userId (string, required): The user whose badge to display
 * - isPremium (boolean, required): Gating for animated badge features
 * Outputs: JSX.Element with static or animated badge
 * Dependencies: React, Badge, BadgeService, animation utils, logger
 */

const AIBadgeOverlay = ({ userId, isPremium }) => {
  const [badgeTitle, setBadgeTitle] = useState('Top Bidder');
  const [badgeDetails, setBadgeDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isPremium) return;

    const loadBadgeStats = async () => {
      try {
        const stats = await fetchUserBadgeStats(userId);
        if (stats && stats.overlayTitle) {
          setBadgeTitle(stats.overlayTitle);
          setBadgeDetails(stats.details);
        }
      } catch (err) {
        logger.error('Failed to load badge stats:', err);
        setError('Unable to load badge details.');
      }
    };

    loadBadgeStats();
  }, [userId, isPremium]);

  const animationStyles = isPremium ? getPremiumBadgeAnimation() : {};

  return (
    <div className="relative inline-block" style={animationStyles}>
      <Badge title={badgeTitle} />
      {isPremium && badgeDetails && (
        <div className="text-xs text-gray-600 mt-1">{badgeDetails}</div>
      )}
      {error && (
        <div className="text-xs text-red-600 mt-1">{error}</div>
      )}
    </div>
  );
};

AIBadgeOverlay.propTypes = {
  userId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default AIBadgeOverlay;