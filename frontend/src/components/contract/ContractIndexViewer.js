// File: ContractIndexViewer.js
// Path: frontend/src/components/contract/ContractIndexViewer.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { theme } from '@/styles/theme';

import { Link } from 'react-router-dom';

const ContractIndexViewer = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contracts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContracts(res.data);
      } catch (err) {
        console.error('Failed to fetch contracts:', err);
        setError('❌ Could not load contracts.');
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📜 Contract Index</h1>
      {loading && <LoadingSpinner />}
      {error && <p className={theme.errorText}>{error}</p>}

      {!loading && !error && contracts.length === 0 && (
        <p className="text-gray-500">No contracts found.</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Contract ID</th>
              <th className="p-2 border">Buyer</th>
              <th className="p-2 border">Lender</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Signed</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr key={c._id}>
                <td className="p-2 border">{c._id}</td>
                <td className="p-2 border">{c.buyer?.email || 'N/A'}</td>
                <td className="p-2 border">{c.lender?.email || 'N/A'}</td>
                <td className="p-2 border">{c.status}</td>
                <td className="p-2 border">{c.isSigned ? '✅' : '❌'}</td>
                <td className="p-2 border space-x-2">
                  <Link to={`/contracts/${c._id}`} className="text-blue-600 underline">View</Link>
                  <Link to={`/contracts/${c._id}/audit`} className="text-indigo-600 underline">Audit</Link>
                  {c.isSigned && c.pdfUrl && (
                    <a
                      href={c.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline"
                    >
                      PDF
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractIndexViewer;
