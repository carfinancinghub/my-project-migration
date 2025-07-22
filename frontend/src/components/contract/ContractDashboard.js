// File: ContractDashboard.js
// Path: frontend/src/components/contract/ContractDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const ContractDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contracts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContracts(res.data);
      } catch (err) {
        console.error('Error fetching contracts', err);
        setError('❌ Failed to load contracts');
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Contract Manager</h1>

        {loading && <p>Loading contracts...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && contracts.length === 0 && (
          <p className="text-gray-500">No contracts found.</p>
        )}

        {!loading && !error && contracts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Auction ID</th>
                  <th className="p-2 border">Buyer</th>
                  <th className="p-2 border">Lender</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Signed</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => (
                  <tr key={c._id}>
                    <td className="p-2 border">{c.auctionId}</td>
                    <td className="p-2 border">{c.buyer?.email || 'N/A'}</td>
                    <td className="p-2 border">{c.lender?.email || 'N/A'}</td>
                    <td className="p-2 border">{c.status}</td>
                    <td className="p-2 border">{c.isSigned ? '✅ Yes' : '❌ No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDashboard;
