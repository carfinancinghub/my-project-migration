// File: JudgeBadgeRenderer.js
// Path: frontend/src/components/disputes/JudgeBadgeRenderer.js

import React from 'react';

const badgeStyles = {
  base: 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full shadow-sm',
  gold: 'bg-yellow-400 text-white',
  silver: 'bg-gray-300 text-gray-900',
  bronze: 'bg-amber-600 text-white',
  first: 'bg-blue-500 text-white',
};

const badgeDescriptions = {
  'Gold Arbitrator': 'Awarded after 30 resolved cases',
  'Silver Arbitrator': 'Awarded after 15 resolved cases',
  'Bronze Arbitrator': 'Awarded after 5 resolved cases',
  'First Verdict': 'Awarded after your first successful resolution',
};

const getBadgeClass = (badge) => {
  if (badge.includes('Gold')) return badgeStyles.gold;
  if (badge.includes('Silver')) return badgeStyles.silver;
  if (badge.includes('Bronze')) return badgeStyles.bronze;
  return badgeStyles.first;
};

const JudgeBadgeRenderer = ({ badges = [] }) => {
  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {badges.map((badge, index) => (
        <span
          key={index}
          className={`${badgeStyles.base} ${getBadgeClass(badge)}`}
          title={badgeDescriptions[badge] || 'Earned recognition'}
        >
          🏅 {badge}
        </span>
      ))}
    </div>
  );
};

export default JudgeBadgeRenderer;
