/**
 * 👑 Crown Certified Component
 * File: ArbitrationDashboard.js
 * Path: frontend/src/components/judge/ArbitrationDashboard.js
 * Purpose: Arbitrator dashboard UI for reviewing and managing dispute cases
 * Author: Cod1 — Rivers Auction Dev Team
 * Date: 2025-05-28
 * SG Man Compliance: ✅ Yes (RBAC, test tags, async handling, modularity)
 * Wow++ Features: 🔮 AI verdict hints, live WebSocket updates, premium flags
 */

// --- Dependencies ---
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Navbar from '@components/Navbar';
import DisputeCard from './components/DisputeCard';
import PremiumBadge from '@components/premium/PremiumBadge';
import SmartVerdictHint from '@components/ai/SmartVerdictHint';
import Unauthorized from '@components/auth/Unauthorized';
import useAuth from '@hooks/useAuth';

const ArbitrationDashboard = () => {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'arbitrator') return;
    axios.get('/api/disputes')
      .then(res => setDisputes(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [user]);

  // 🔄 WebSocket live update (Wow++)
  useEffect(() => {
    if (!user || user.role !== 'arbitrator') return;
    const socket = io(); // assumes backend runs socket.io server
    socket.on('disputeUpdated', updatedDispute => {
      setDisputes(prev =>
        prev.map(d => d._id === updatedDispute._id ? updatedDispute : d)
      );
    });
    return () => socket.disconnect();
  }, [user]);

  if (!user || user.role !== 'arbitrator') return <Unauthorized />;

  return (
    <div className="arbitration-dashboard">
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Arbitration Dashboard</h1>

        <PremiumBadge level="arbitrator" />

        {loading && <p data-testid="loading">Loading disputes...</p>}
        {error && <p className="text-red-600" data-testid="error">Error loading disputes.</p>}

        <div className="grid gap-4 mt-4" data-testid="dispute-list">
          {disputes.map(dispute => (
            <DisputeCard key={dispute._id} dispute={dispute}>
              <SmartVerdictHint dispute={dispute} />
            </DisputeCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArbitrationDashboard;
