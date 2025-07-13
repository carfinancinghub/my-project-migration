// 👑 Crown Certified Component — PredictiveGraph.jsx
// Path: frontend/src/components/common/PredictiveGraph.jsx
// Purpose: Display AI trend lines for predictive insights
// Author: Rivers Auction Team — May 18, 2025
// Cod2 Crown Certified

import React from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const PredictiveGraph = ({ data }) => {
  if (!Array.isArray(data)) {
    logger.error('Invalid data passed to PredictiveGraph', data);
    return <p className="text-red-600">❌ Unable to render trend data.</p>;
  }

  return (
    <div className="w-full h-64 bg-white rounded shadow p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

PredictiveGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PredictiveGraph;
