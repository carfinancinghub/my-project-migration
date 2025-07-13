// File: UserTrustBadges.jsx
// Path: frontend/src/components/admin/UserTrustBadges.jsx
// 👑 Cod1 Crown Certified
// Purpose: Display trust and reputation badges for users in admin views
// Author: SG + Cod1
// Date: April 29, 2025

import React from 'react';
import PropTypes from 'prop-types';

const UserTrustBadges = ({ reputationScore }) => {
  const getBadge = (score) => {
    if (score > 90) return 'Platinum';
    if (score > 75) return 'Gold';
    if (score > 50) return 'Silver';
    if (score > 25) return 'Bronze';
    return 'New';
  };

  const badge = getBadge(reputationScore);

  const badgeColor = {
    Platinum: 'bg-indigo-600',
    Gold: 'bg-yellow-500',
    Silver: 'bg-gray-400',
    Bronze: 'bg-amber-700',
    New: 'bg-green-500',
  }[badge];

  return (
    <span className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full ${badgeColor}`}>
      {badge} Badge
    </span>
  );
};

UserTrustBadges.propTypes = {
  reputationScore: PropTypes.number.isRequired,
};

export default UserTrustBadges;
