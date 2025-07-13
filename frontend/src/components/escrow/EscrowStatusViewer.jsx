```
// 👑 Crown Certified Component — EscrowStatusViewer.jsx
// Path: frontend/src/components/escrow/EscrowStatusViewer.jsx
// Purpose: User-facing component to view escrow transaction status and blockchain audit trail (premium-only).
// Author: Rivers Auction Team — May 16, 2025

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api } from '@services/api';
import logger from '@utils/logger';
import { PremiumGate } from '@components/common';
import { Clock, FileText } from 'lucide-react';

const EscrowStatusViewer = ({ transactionId, isPremium }) => {
  const [status, setStatus] = useState(null);
  const [auditTrail, setAuditTrail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatus();
  }, [transactionId]);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/escrow/status/${transactionId}`);
      setStatus(response.data.data);
      setError(null);
    } catch (err) {
      logger.error(`Failed to fetch status for ${transactionId}`, err);
      setError(err.response?.data?.message || 'Unable to load status');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditTrail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/escrow/audit/${transactionId}`, {
        params: { isPremium: true },
      });
      setAuditTrail(response.data.data);
      setError(null);
    } catch (err) {
      logger.error(`Failed to fetch audit trail for ${transactionId}`, err);
      setError(err.response?.data?.message || 'Audit trail fetch failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="escrow-status-viewer">
      <h3>Escrow Status</h3>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}
      {status && (
        <div className="status">
          <p><strong>Transaction ID:</strong> {status.transactionId}</p>
          <p><strong>Action Type:</strong> {status.actionType}</p>
          <p><strong>User ID:</strong> {status.userId}</p>
          <p><strong>Status:</strong> {status.status}</p>
          <p>
            <strong>Created At:</strong> {new Date(status.createdAt).toLocaleString()}
            {status.status === 'pending' && <Clock className="text-red-500" title="Time-sensitive" />}
          </p>
        </div>
      )}
      <PremiumGate isPremium={isPremium} message="Audit trail requires premium access">
        <div className="audit-trail">
          <button
            onClick={fetchAuditTrail}
            disabled={loading}
            className="audit-button"
          >
            <FileText /> Load Audit Trail
          </button>
          {auditTrail && (
            <div>
              <h4>Blockchain Audit Trail</h4>
              <ul>
                {auditTrail.map((event, index) => (
                  <li key={index}>{`${event.event} at ${event.timestamp}`}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </PremiumGate>
    </div>
  );
};

EscrowStatusViewer.propTypes = {
  transactionId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default EscrowStatusViewer;

/*
Functions Summary:
- EscrowStatusViewer
  - Purpose: User-facing component to view escrow transaction status and blockchain audit trail (premium)
  - Inputs:
    - transactionId: string (required)
    - isPremium: boolean (required)
  - Outputs: React component rendering status details and audit trail panel
  - Features:
    - Displays transaction status (ID, action type, user ID, status, created date)
    - Fetches real-time status via GET /api/escrow/status
    - Premium-gated audit trail via GET /api/escrow/audit
    - Urgency indicators for pending transactions
  - Dependencies: react, prop-types, @services/api, @utils/logger, @components/common/PremiumGate, lucide-react
*/
```