// File: AdminDisputeDashboard.jsx
// Path: frontend/src/components/admin/disputes/AdminDisputeDashboard.jsx
// Purpose: Admin dashboard for reviewing and managing disputes with premium AI features
// Author: Cod2
// Date: 2025-05-01
// 👑 Cod2 Crown Certified

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import DisputeSimulator from '@/components/disputes/DisputeSimulator';
import PremiumFeature from '@/components/common/PremiumFeature';

const AdminDisputeDashboard = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisputeId, setSelectedDisputeId] = useState(null);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await axios.get('/api/disputes');
        setDisputes(res.data);
      } catch (err) {
        toast.error('Failed to load disputes');
      } finally {
        setLoading(false);
      }
    };
    fetchDisputes();
  }, []);

  const handleSelectDispute = (id) => {
    setSelectedDisputeId(id);
  };

  const renderBadge = (riskScore) => {
    if (riskScore >= 0.75) return <span className="text-red-600 font-semibold">🔴 High Risk</span>;
    if (riskScore >= 0.5) return <span className="text-yellow-600 font-semibold">🟠 Review Needed</span>;
    return <span className="text-green-600 font-semibold">🟢 Low Risk</span>;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dispute Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {disputes.map((dispute) => (
          <div
            key={dispute._id}
            className="border p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer"
            onClick={() => handleSelectDispute(dispute._id)}
          >
            <h2 className="font-semibold">Dispute #{dispute._id.slice(-6)}</h2>
            <p className="text-sm text-gray-600">Buyer: {dispute.buyerId}</p>
            <p className="text-sm text-gray-600">Seller: {dispute.sellerId}</p>
            <p className="text-sm text-gray-600">Status: {dispute.status}</p>
            <PremiumFeature>
              {dispute.riskScore !== undefined && (
                <p className="text-sm mt-1">Risk Level: {renderBadge(dispute.riskScore)}</p>
              )}
            </PremiumFeature>
          </div>
        ))}
      </div>

      {selectedDisputeId && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Dispute Simulation</h2>
          <PremiumFeature>
            <DisputeSimulator disputeId={selectedDisputeId} />
          </PremiumFeature>
        </div>
      )}
    </div>
  );
};

export default AdminDisputeDashboard;
