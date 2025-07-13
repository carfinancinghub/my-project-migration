import React from 'react';

const ReputationBadgeTier = ({ badgeCount = 0, reputation = 0 }) => {
  let tier = 'None';
  let icon = '⬜';

  if (badgeCount >= 20 || reputation >= 100) {
    tier = 'Gold';
    icon = '🥇';
  } else if (badgeCount >= 10 || reputation >= 50) {
    tier = 'Silver';
    icon = '🥈';
  } else if (badgeCount >= 5 || reputation >= 20) {
    tier = 'Bronze';
    icon = '🥉';
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xl">{icon}</span>
      <span className="text-sm text-gray-600">{tier} Tier</span>
    </div>
  );
};

export default ReputationBadgeTier;