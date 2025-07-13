// File: EscrowPaymentManager.jsx
// Path: frontend/src/components/escrow/EscrowPaymentManager.jsx
// Author: Cod2 Crown Certified v1.1 (05072038 CA Time)
// Description: Hybrid version with backend API integration, role-based controls, and premium blockchain traceability for escrow payments

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import PremiumFeature from '@/components/common/PremiumFeature';

const EscrowPaymentManager = ({ role = 'buyer' }) => {
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Wire');
  const [status, setStatus] = useState('Pending');
  const [txHash, setTxHash] = useState(null);

  const checkPermissions = (action) => {
    if (role === 'escrowOfficer') return true;
    if (role === 'buyer' && action === 'deposit') return true;
    if (role === 'seller') return false;
    return false;
  };

  const handleDeposit = async () => {
    if (!checkPermissions('deposit')) return toast.error('Unauthorized action.');
    try {
      const res = await axios.post('/api/escrow/deposit', {
        transactionId, amount, method
      });
      toast.success(`Deposit of $${amount} submitted.`);
      setStatus('Deposited');
      if (res.data.txHash) setTxHash(res.data.txHash);
    } catch (err) {
      toast.error('Deposit failed.');
    }
  };

  const handleRelease = async () => {
    if (!checkPermissions('release')) return toast.error('Only escrow officers can release.');
    try {
      const res = await axios.post('/api/escrow/release', { transactionId });
      toast.success('Funds released successfully.');
      setStatus('Released');
      if (res.data.txHash) setTxHash(res.data.txHash);
    } catch {
      toast.error('Release failed.');
    }
  };

  const handleRefund = async () => {
    if (!checkPermissions('refund')) return toast.error('Only escrow officers can refund.');
    try {
      const res = await axios.post('/api/escrow/refund', { transactionId });
      toast.success('Refund issued successfully.');
      setStatus('Refunded');
    } catch {
      toast.error('Refund failed.');
    }
  };

  const renderBlockchainStatus = () => (
    txHash ? (
      <div className="mt-2 text-sm text-blue-600">
        Blockchain TX Hash: <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">{txHash}</a>
      </div>
    ) : null
  );

  return (
    <div className="p-4 border rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Escrow Payment Manager</h2>
      <input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Transaction ID" className="input mb-2" />
      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="input mb-2" type="number" />
      <select value={method} onChange={(e) => setMethod(e.target.value)} className="input mb-2">
        <option>Wire</option>
        <option>ACH</option>
        <option>Crypto</option>
      </select>

      <div className="flex gap-2 mb-2">
        <button onClick={handleDeposit} className="btn">Deposit</button>
        {role === 'escrowOfficer' && <>
          <button onClick={handleRelease} className="btn">Release</button>
          <button onClick={handleRefund} className="btn">Refund</button>
        </>}
      </div>

      <p>Status: <strong>{status}</strong></p>

      <PremiumFeature feature="escrowAutomation">
        {renderBlockchainStatus() || <p className="text-sm text-gray-600 mt-4">Premium features like blockchain traceability are enabled.</p>}
      </PremiumFeature>
    </div>
  );
};

export default EscrowPaymentManager;
