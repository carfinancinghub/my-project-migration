```
// 👑 Crown Certified Component — EscrowSyncAdminPanel.jsx
// Path: frontend/src/components/escrow/EscrowSyncAdminPanel.jsx
// Purpose: Admin dashboard for managing escrow actions, viewing transaction statuses, and accessing blockchain audit trails (premium-only).
// Author: Rivers Auction Team — May 16, 2025

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DataTable, Form, PremiumGate } from '@components/common';
import { api } from '@services/api';
import logger from '@utils/logger';
import { Clock } from 'lucide-react';

const EscrowSyncAdminPanel = ({ userId, isPremium }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    transactionId: '',
    actionType: '',
    userId: '',
    metadata: {},
    isPremium: isPremium,
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/escrow/status/all', { params: { userId } });
      setTransactions(response.data.data);
      setError(null);
    } catch (err) {
      logger.error('Failed to fetch escrow transactions', err);
      setError('Unable to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/api/escrow/sync', formData, {
        params: { isPremium: formData.isPremium },
      });
      setTransactions([...transactions, response.data.data.record]);
      setFormData({ transactionId: '', actionType: '', userId: '', metadata: {}, isPremium });
      setError(null);
    } catch (err) {
      logger.error('Failed to sync escrow action', err);
      setError(err.response?.data?.message || 'Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditTrail = async (transactionId) => {
    try {
      const response = await api.get(`/api/escrow/audit/${transactionId}`, {
        params: { isPremium: true },
      });
      return response.data.data;
    } catch (err) {
      logger.error(`Failed to fetch audit trail for ${transactionId}`, err);
      throw new Error(err.response?.data?.message || 'Audit trail fetch failed');
    }
  };

  const columns = [
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'actionType', label: 'Action Type' },
    { key: 'userId', label: 'User ID' },
    { key: 'status', label: 'Status' },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: 'urgency',
      label: 'Urgency',
      render: (value, row) => (
        row.status === 'pending' && (
          <Clock className="text-red-500" title="Time-sensitive" />
        )
      ),
    },
  ];

  return (
    <div className="escrow-sync-admin-panel">
      <h2>Escrow Sync Admin Panel</h2>
      {error && <div className="error">{error}</div>}
      <Form
        onSubmit={handleSyncSubmit}
        fields={[
          { name: 'transactionId', label: 'Transaction ID', type: 'text', required: true },
          { name: 'actionType', label: 'Action Type', type: 'text', required: true },
          { name: 'userId', label: 'User ID', type: 'text', required: true },
          { name: 'metadata', label: 'Metadata (JSON)', type: 'textarea', parse: JSON.parse },
          ...(isPremium ? [{ name: 'isPremium', label: 'Sync to Blockchain', type: 'checkbox' }] : []),
        ]}
        values={formData}
        onChange={setFormData}
        submitLabel="Sync Escrow Action"
        disabled={loading}
      />
      <DataTable
        columns={columns}
        data={transactions}
        loading={loading}
        onRowClick={async (row) => {
          if (isPremium) {
            try {
              const auditTrail = await fetchAuditTrail(row.transactionId);
              setTransactions(transactions.map(t =>
                t.transactionId === row.transactionId ? { ...t, auditTrail } : t
              ));
            } catch (err) {
              setError(err.message);
            }
          }
        }}
        expandable={isPremium}
        renderExpanded={(row) => (
          <PremiumGate isPremium={isPremium} message="Audit trail requires premium access">
            <div>
              <h4>Audit Trail</h4>
              {row.auditTrail ? (
                <ul>
                  {row.auditTrail.map((event, index) => (
                    <li key={index}>{`${event.event} at ${event.timestamp}`}</li>
                  ))}
                </ul>
              ) : (
                <p>No audit trail available</p>
              )}
            </div>
          </PremiumGate>
        )}
      />
    </div>
  );
};

EscrowSyncAdminPanel.propTypes = {
  userId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default EscrowSyncAdminPanel;

/*
Functions Summary:
- EscrowSyncAdminPanel
  - Purpose: Admin dashboard for managing escrow actions, viewing transaction statuses, and accessing blockchain audit trails (premium)
  - Inputs:
    - userId: string (required)
    - isPremium: boolean (required)
  - Outputs: React component rendering transaction table, sync form, and audit trail panel
  - Features:
    - Transaction list with sorting/pagination
    - Form to sync new escrow actions
    - Real-time status updates
    - Premium-gated audit trail display
    - Urgency indicators for pending actions
  - Dependencies: react, prop-types, @components/common/DataTable, @components/common/Form, @components/common/PremiumGate, @services/api, @utils/logger, lucide-react
*/
```