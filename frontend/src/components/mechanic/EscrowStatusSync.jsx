// File: EscrowStatusSync.jsx
// Path: frontend/src/components/mechanic/EscrowStatusSync.jsx
// Author: Cod1 (05051245)

import React, { useState } from 'react';
import axios from 'axios';
import Card from '@components/common/Card';
import { PremiumFeature } from '@components/common/PremiumFeature';

const EscrowStatusSync = () => {
  const [vehicleId, setVehicleId] = useState('');
  const [status, setStatus] = useState(null);

  const handleNotify = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Mocking API delay
      setStatus('✅ Sent to Escrow');
    } catch (err) {
      setStatus('❌ Failed to notify Escrow');
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-2">Notify Escrow</h2>
      <input
        value={vehicleId}
        onChange={(e) => setVehicleId(e.target.value)}
        placeholder="Enter Vehicle ID"
        className="w-full border p-2 mb-2"
      />
      <PremiumFeature feature="mechanicEnterprise">
        <button onClick={handleNotify} className="bg-green-600 text-white px-4 py-2 rounded">
          Notify Escrow
        </button>
        {status && <p className="mt-2 text-sm">{status}</p>}
      </PremiumFeature>
    </Card>
  );
};

export default EscrowStatusSync;
