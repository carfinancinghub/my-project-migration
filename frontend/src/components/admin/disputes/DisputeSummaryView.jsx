// File: DisputeSummaryView.jsx
// Path: frontend/src/components/admin/disputes/DisputeSummaryView.jsx
// 👑 Cod1 Crown Certified
// Purpose: Display a summary of dispute outcomes for admin insights and trend tracking
// Author: SG + Cod1
// Date: April 29, 2025

import React from 'react';
import PropTypes from 'prop-types';

const DisputeSummaryView = ({ disputes }) => {
  if (!disputes || disputes.length === 0) {
    return <div className="text-gray-500">No disputes to display</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Dispute Summary</h3>
      <table className="min-w-full border divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Case ID</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Resolved By</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Outcome</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {disputes.map(dispute => (
            <tr key={dispute.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{dispute.id}</td>
              <td className="px-4 py-2">{dispute.status}</td>
              <td className="px-4 py-2">{dispute.resolvedBy || 'Pending'}</td>
              <td className="px-4 py-2">{dispute.outcome || 'TBD'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

DisputeSummaryView.propTypes = {
  disputes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    resolvedBy: PropTypes.string,
    outcome: PropTypes.string,
  })),
};

export default DisputeSummaryView;
