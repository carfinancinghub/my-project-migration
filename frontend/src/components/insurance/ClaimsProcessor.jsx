// File: ClaimsProcessor.jsx
// Path: frontend/src/components/insurance/ClaimsProcessor.jsx
// Author: Cod2 (05022021)
// 👑 Crown Certified
// Purpose: Allow insurers to view, process, and resolve claims with support for premium AI-driven fraud detection.
// Functions:
// - useEffect(loadClaims): Loads mock claim records
// - updateClaimStatus(): Updates status and triggers feedback

import React, { useEffect, useState } from 'react';
import PremiumFeature from '@components/common/PremiumFeature';
import { toast } from 'react-hot-toast';

const ClaimsProcessor = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const loadClaims = async () => {
      setClaims([
        { id: 'CLM001', userId: 'U123', vehicleId: 'V001', status: 'Pending', resolution: '' },
        { id: 'CLM002', userId: 'U456', vehicleId: 'V002', status: 'In Review', resolution: '' },
      ]);
    };
    loadClaims();
  }, []);

  const updateClaimStatus = (id, newStatus) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus, resolution: `Marked as ${newStatus}` } : c))
    );
    toast.success(`Claim ${id} marked as ${newStatus}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Claims Processor</h2>
      <ul className="space-y-4">
        {claims.map((claim) => (
          <li key={claim.id} className="bg-white rounded shadow p-4">
            <p><strong>Claim ID:</strong> {claim.id}</p>
            <p><strong>User ID:</strong> {claim.userId}</p>
            <p><strong>Vehicle ID:</strong> {claim.vehicleId}</p>
            <p><strong>Status:</strong> {claim.status}</p>
            <p><strong>Resolution:</strong> {claim.resolution || 'N/A'}</p>

            <div className="mt-2 flex gap-2">
              <button onClick={() => updateClaimStatus(claim.id, 'Approved')} className="btn">Approve</button>
              <button onClick={() => updateClaimStatus(claim.id, 'Denied')} className="btn">Deny</button>
              <button onClick={() => updateClaimStatus(claim.id, 'Needs More Info')} className="btn">Request Info</button>
            </div>
          </li>
        ))}
      </ul>

      <PremiumFeature feature="insuranceAI">
        <p className="mt-4 text-sm text-gray-500">Enterprise: AI fraud scoring & SLA-based celebration effects coming soon.</p>
      </PremiumFeature>
    </div>
  );
};

export default ClaimsProcessor;
