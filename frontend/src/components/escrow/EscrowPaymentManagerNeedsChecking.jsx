// File: EscrowPaymentManager.jsx
// Path: frontend/src/components/escrow/EscrowPaymentManager.jsx
// Author: Cod2 (05071915)
// Description: Handles deposit, release, and refund UI for Escrow Officers (Free Tier)

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const EscrowPaymentManager = ({ transactionId }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/escrow/payments/${action}`, { transactionId });
      setStatus(res.data.message);
    } catch (err) {
      setStatus('Error: ' + err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Escrow Payment Actions</h2>
      <div className="flex gap-2 mb-2">
        <Button disabled={loading} onClick={() => handleAction('deposit')}>Deposit</Button>
        <Button disabled={loading} onClick={() => handleAction('release')}>Release</Button>
        <Button disabled={loading} onClick={() => handleAction('refund')}>Refund</Button>
      </div>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
};

export default EscrowPaymentManager;
