// File: InsuranceDashboard.js
// Path: frontend/src/components/InsuranceDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const InsuranceDashboard = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/insurance/bids`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBids(res.data);
      } catch (err) {
        setError('❌ Failed to fetch insurance bids');
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Insurance Bid Dashboard</h2>

        {loading && <p>Loading insurance bids...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          bids.length === 0 ? (
            <p className="text-gray-500">No current bids available.</p>
          ) : (
            <ul className="space-y-4">
              {bids.map((bid) => (
                <li key={bid._id} className="border rounded p-4 shadow">
                  <p><strong>Policy:</strong> {bid.policyType}</p>
                  <p><strong>Vehicle:</strong> {bid.vehicle?.make} {bid.vehicle?.model} ({bid.vehicle?.year})</p>
                  <p><strong>Quote:</strong> ${bid.quoteAmount}</p>
                  <p><strong>Status:</strong> {bid.status}</p>
                  <p><strong>Submitted by:</strong> {bid.providerName || 'Unverified'}</p>

                  <div className="mt-3">
                    <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      ✅ Approve Quote
                    </button>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 ml-2">
                      ✏️ Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
};

export default InsuranceDashboard;
