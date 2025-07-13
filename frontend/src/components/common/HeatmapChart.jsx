// File: HeatmapChart.jsx
// Path: frontend/src/components/common/HeatmapChart.jsx
// Purpose: Visualize bid frequency as a heatmap for premium auction users
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import PropTypes from 'prop-types';
import logger from '@/utils/logger';

/**
 * HeatmapChart component
 * @param {Array} data - Array of objects containing timeWindow and bidCount.
 * @param {Boolean} isPremium - Whether the user has access to premium features.
 */
const HeatmapChart = ({ data, isPremium }) => {
  try {
    if (!isPremium) {
      return <div className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock bid heatmaps.</div>;
    }

    if (!Array.isArray(data)) {
      throw new Error('Invalid heatmap data');
    }

    return (
      <div className="p-4 bg-white border rounded-md shadow">
        <h3 className="text-lg font-semibold mb-2">Bid Frequency Heatmap</h3>
        <ul className="space-y-1">
          {data.map((entry, idx) => (
            <li key={idx} className="text-sm text-gray-700">
              <span className="font-mono text-blue-800">{entry.timeWindow}</span>: {entry.bidCount} bids
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    logger.error('HeatmapChart render error:', error);
    return <div className="text-red-600 text-sm">Error rendering heatmap</div>;
  }
};

HeatmapChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      timeWindow: PropTypes.string.isRequired,
      bidCount: PropTypes.number.isRequired,
    })
  ).isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default HeatmapChart;

/*
Functions Summary:
- HeatmapChart
  - Purpose: Render a bid frequency heatmap for auctions.
  - Inputs:
    - data (array): Array of { timeWindow, bidCount } objects.
    - isPremium (boolean): Feature gating flag.
  - Output:
    - JSX heatmap or upgrade message.
  - Dependencies:
    - React, PropTypes, @utils/logger
*/