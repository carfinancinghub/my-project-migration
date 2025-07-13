// File: TransportDashboard.js
// Path: frontend/src/components/hauler/TransportDashboard.js

import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '@/utils/useAuth';
import Navbar from '@/components/common/Navbar';

const TransportDashboard = () => {
  const { role } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">🚚 Hauler Operations Center</h1>

        <div className="space-y-4">
          <Link to="/hauler/jobs" className="block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">
            View Delivery Jobs
          </Link>

          <Link to="/hauler/history" className="block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded">
            Job History
          </Link>

          <Link to="/hauler/verify" className="block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
            Verify Delivery
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-4">Current Role: <strong>{role}</strong></p>
      </div>
    </div>
  );
};

export default TransportDashboard;
