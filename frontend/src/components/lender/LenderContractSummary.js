// File: LenderContractSummary.js
// Path: frontend/src/components/lender/LenderContractSummary.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';
import { theme } from '../../styles/theme';
import Navbar from '../layout/Navbar';

const LenderContractSummary = () => {
  const [contracts, setContracts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/lender/contracts/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContracts(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError('❌ Failed to load contracts');
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [token]);

  useEffect(() => {
    let temp = [...contracts];
    if (statusFilter !== 'All') {
      temp = temp.filter(c => c.status === statusFilter);
    }
    if (search) {
      temp = temp.filter(c =>
        c.buyer?.email?.toLowerCase().includes(search.toLowerCase()) ||
        c._id?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(temp);
  }, [statusFilter, search, contracts]);

  const exportCSV = () => {
    const csvContent = [
      ['Contract ID', 'Buyer', 'Status', 'Date'],
      ...filtered.map(c => [
        c._id,
        c.buyer?.email || 'N/A',
        c.status,
        new Date(c.createdAt).toLocaleDateString()
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contract_summary.csv';
    link.click();
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📋 Lender Contract Summary</h1>

        {loading && <LoadingSpinner />}
        {error && <p className={theme.errorText}>{error}</p>}

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded w-full md:w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Buyer or ID"
            className="border p-2 rounded w-full md:w-64"
          />

          <Button onClick={exportCSV} className="w-full md:w-auto">
            📤 Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Contract ID</th>
                <th className="p-2 border">Buyer</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} className="text-sm">
                  <td className="p-2 border">{c._id}</td>
                  <td className="p-2 border">{c.buyer?.email || 'N/A'}</td>
                  <td className="p-2 border">
                    <span
                      className={
                        c.status === 'Approved'
                          ? 'text-green-600 font-semibold'
                          : c.status === 'Rejected'
                          ? 'text-red-600 font-semibold'
                          : 'text-yellow-600 font-semibold'
                      }
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-2 border">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LenderContractSummary;
