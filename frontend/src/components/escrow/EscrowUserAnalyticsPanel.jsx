// File: EscrowUserAnalyticsPanel.jsx
// Path: frontend/src/components/escrow/EscrowUserAnalyticsPanel.jsx
// Author: Cod2 (05072100)
// Description: Shows escrow officer performance stats

import React from 'react';

const EscrowUserAnalyticsPanel = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="bg-white shadow p-4 rounded-xl">
      <h3 className="font-bold mb-3 text-indigo-700">📊 Officer Performance</h3>
      <ul className="space-y-2">
        <li><strong>Transactions Closed:</strong> {stats.closed}</li>
        <li><strong>Avg. Release Time:</strong> {stats.avgReleaseTime} hrs</li>
        <li><strong>Flags Raised:</strong> {stats.flags}</li>
      </ul>
    </div>
  );
};

export default EscrowUserAnalyticsPanel;
