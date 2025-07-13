// File: SellerBadgePanel.jsx
// Path: frontend/src/components/auction/SellerBadgePanel.jsx
// Purpose: Show gamified seller badges and rank visuals gated for premium users
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import PropTypes from 'prop-types';
import logger from '@/utils/logger';

/**
 * SellerBadgePanel Component
 * @param {Object} sellerStats - Includes winRate, bidVelocity, engagementScore.
 * @param {Boolean} isPremium - Whether user has access to premium rank features.
 */
const SellerBadgePanel = ({ sellerStats, isPremium }) => {
  try {
    if (!isPremium) {
      return <div className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock seller badge analytics.</div>;
    }

    if (!sellerStats || typeof sellerStats !== 'object') {
      throw new Error('Invalid sellerStats input');
    }

    const { winRate, bidVelocity, engagementScore } = sellerStats;

    return (
      <div className="p-4 border rounded bg-white shadow">
        <h3 className="text-lg font-semibold mb-2">Seller Rank & Badge Panel</h3>
        <ul className="text-sm space-y-1">
          <li>🏆 Win Rate: <span className="font-medium">{winRate}%</span></li>
          <li>⚡ Bid Velocity: <span className="font-medium">{bidVelocity} bids/hour</span></li>
          <li>🔥 Engagement Score: <span className="font-medium">{engagementScore}/100</span></li>
        </ul>
      </div>
    );
  } catch (error) {
    logger.error('SellerBadgePanel render error:', error);
    return <div className="text-red-600 text-sm">Error rendering seller badge panel</div>;
  }
};

SellerBadgePanel.propTypes = {
  sellerStats: PropTypes.shape({
    winRate: PropTypes.number.isRequired,
    bidVelocity: PropTypes.number.isRequired,
    engagementScore: PropTypes.number.isRequired,
  }).isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default SellerBadgePanel;

/*
Functions Summary:
- SellerBadgePanel
  - Purpose: Display seller’s gamified metrics and performance badges.
  - Inputs:
    - sellerStats (object): Contains winRate, bidVelocity, engagementScore.
    - isPremium (boolean): Feature gating flag.
  - Output:
    - JSX-rendered rank panel or locked message.
  - Dependencies:
    - React, PropTypes, @utils/logger
*/
