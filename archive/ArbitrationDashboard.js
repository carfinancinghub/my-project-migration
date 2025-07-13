// File: ArbitrationDashboard.js
// Path: frontend/src/components/judge/ArbitrationDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const ArbitrationDashboard = () => {
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    axios.get('/api/disputes').then(res => setDisputes(res.data));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Arbitration Dashboard</h1>
        <div className="grid gap-4">
          {disputes.map(dispute => (
            <div key={dispute._id} className="border p-4 rounded">
              <h2 className="text-lg">Dispute ID: {dispute._id}</h2>
              <p>Parties: {dispute.parties}</p>
              <p>Status: {dispute.status}</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Review Case</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArbitrationDashboard;