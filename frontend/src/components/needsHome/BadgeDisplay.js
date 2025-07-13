// File: BadgeDisplay.js
// Path: frontend/src/components/BadgeDisplay.js

import React from 'react';

const badgeColors = {
  Bronze: 'bg-yellow-600 text-white',
  Silver: 'bg-gray-400 text-black',
  Gold: 'bg-yellow-300 text-black',
  Platinum: 'bg-blue-400 text-white',
};

const BadgeDisplay = ({ level = 'Bronze', label }) => {
  const badgeStyle = badgeColors[level] || 'bg-gray-200 text-black';

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}> 
      {label || level} Badge
    </span>
  );
};

export default BadgeDisplay;
