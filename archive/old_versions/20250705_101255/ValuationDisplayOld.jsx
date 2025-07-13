// 👑 Crown Certified Component — ValuationDisplay.jsx
// Path: frontend/src/components/common/ValuationDisplay.jsx
// Purpose: Render valuation insights like estimated value and probability
// Author: Rivers Auction Team — May 18, 2025
// Cod2 Crown Certified

import React from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';

const ValuationDisplay = ({ data }) => {
  if (!data || typeof data !== 'object') {
    logger.error('Invalid valuation data provided to ValuationDisplay');
    return <p className="text-red-600">Error loading valuation metrics.</p>;
  }

  return (
    <div className="space-y-2 border p-4 rounded-lg shadow bg-gray-50">
      <div>
        <span className="font-semibold">📊 Estimated Market Value:</span>{' '}
        <span className="text-green-700">${data.estimatedValue?.toLocaleString() || 'N/A'}</span>
      </div>
      <div>
        <span className="font-semibold">🎯 Bid Success Probability:</span>{' '}
        <span className="text-blue-700">{data.successProbability ? `${(data.successProbability * 100).toFixed(1)}%` : 'N/A'}</span>
      </div>
      {data?.modelInfo && (
        <div className="text-sm text-gray-600 italic">
          Model: {data.modelInfo}
        </div>
      )}
    </div>
  );
};

ValuationDisplay.propTypes = {
  data: PropTypes.shape({
    estimatedValue: PropTypes.number,
    successProbability: PropTypes.number,
    modelInfo: PropTypes.string,
  }).isRequired,
};

export default ValuationDisplay;
