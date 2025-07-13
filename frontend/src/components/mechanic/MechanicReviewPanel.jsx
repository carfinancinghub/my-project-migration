// File: MechanicReviewPanel.jsx
// Path: frontend/src/components/mechanic/MechanicReviewPanel.jsx
// 👑 Cod1 Crown Certified
// Purpose: Mechanic reviews inspection reports and approves/rejects them
// Author: SG + Cod1
// Date: April 29, 2025

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MechanicReviewPanel = ({ inspection, onDecision }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDecision = async (decision) => {
    try {
      setLoading(true);
      setError('');
      await onDecision(decision);
    } catch (err) {
      setError('Failed to submit decision');
    } finally {
      setLoading(false);
    }
  };

  if (!inspection) {
    return <p className="text-gray-500">No inspection selected.</p>;
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Inspection Report: {inspection.carModel}</h2>
      <p className="text-gray-600 mb-4">{inspection.notes}</p>

      <div className="flex space-x-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loading}
          onClick={() => handleDecision('approve')}
        >
          Approve
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          disabled={loading}
          onClick={() => handleDecision('reject')}
        >
          Reject
        </button>
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
};

MechanicReviewPanel.propTypes = {
  inspection: PropTypes.shape({
    carModel: PropTypes.string.isRequired,
    notes: PropTypes.string,
  }),
  onDecision: PropTypes.func.isRequired,
};

export default MechanicReviewPanel;
