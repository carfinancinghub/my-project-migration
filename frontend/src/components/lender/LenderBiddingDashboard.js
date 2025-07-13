// File: LenderBiddingDashboard.js
// Path: frontend/src/components/lender/LenderBiddingDashboard.js
// 👑 Cod1 Crown Certified — Smart Loan Matching + AI Intelligence

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../admin/layout/AdminLayout';
import LenderBidDetailCard from './LenderBidDetailCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import Input from '../common/Input';
import { CSVLink } from 'react-csv';

const LenderBiddingDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/loans`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLoans(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Error fetching loans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setQuery(val);
    const filteredResults = loans.filter(loan =>
      loan.applicant?.toLowerCase().includes(val) ||
      loan._id?.toLowerCase().includes(val) ||
      (loan.amount + '').includes(val)
    );
    setFiltered(filteredResults);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Lender Bidding Dashboard</h1>
          <CSVLink
            data={filtered}
            filename="loan_bids_export.csv"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export CSV
          </CSVLink>
        </div>

        <Input
          type="text"
          placeholder="Search by applicant, ID, or amount..."
          value={query}
          onChange={handleSearch}
          className="w-full md:w-1/2"
        />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <p className="text-gray-500">No loan applications found.</p>
            ) : (
              filtered.map(loan => (
                <LenderBidDetailCard key={loan._id} bid={loan} />
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default LenderBiddingDashboard;
