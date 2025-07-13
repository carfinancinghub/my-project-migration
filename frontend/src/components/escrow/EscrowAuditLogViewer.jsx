// File: EscrowAuditLogViewer.jsx
// Path: frontend/src/components/escrow/EscrowAuditLogViewer.jsx
// Author: Cod2 (05072100)
// Description: Displays the audit trail for escrow actions

import React from 'react';
import PropTypes from 'prop-types';

const EscrowAuditLogViewer = ({ logs }) => {
  if (!logs || logs.length === 0) return <p className="text-gray-500">No audit records found.</p>;

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="font-bold mb-2">🕓 Audit Trail</h3>
      <ul className="space-y-1 text-sm">
        {logs.map((log, idx) => (
          <li key={idx}>
            {new Date(log.timestamp).toLocaleString()} — <strong>{log.action}</strong> by {log.user || 'System'}
          </li>
        ))}
      </ul>
    </div>
  );
};

EscrowAuditLogViewer.propTypes = {
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      user: PropTypes.string,
    })
  ),
};

export default EscrowAuditLogViewer;
