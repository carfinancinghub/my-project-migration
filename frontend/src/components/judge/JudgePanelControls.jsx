// File: JudgePanelControls.jsx
// Path: frontend/src/components/judge/JudgePanelControls.jsx
// 👑 Cod1 Crown Certified
// Purpose: UI controls for judges to cast votes or issue rulings
// Author: SG + Cod1
// Date: April 29, 2025

import React from 'react';
import PropTypes from 'prop-types';

const JudgePanelControls = ({ caseId, onVote }) => {
  const handleVote = (vote) => {
    if (onVote) onVote({ caseId, vote });
  };

  return (
    <div className="flex flex-col gap-3 bg-white p-5 rounded shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">Cast Your Vote</h3>
      <div className="flex gap-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => handleVote('approve')}
        >
          Approve
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => handleVote('reject')}
        >
          Reject
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => handleVote('neutral')}
        >
          Neutral
        </button>
      </div>
    </div>
  );
};

JudgePanelControls.propTypes = {
  caseId: PropTypes.string.isRequired,
  onVote: PropTypes.func.isRequired,
};

export default JudgePanelControls;
