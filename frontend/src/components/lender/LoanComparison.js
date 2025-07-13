// File: LoanComparison.js
// Path: frontend/src/components/lender/LoanComparison.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../admin/layout/AdminLayout';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const LoanComparison = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/lender/loans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoans(res.data);
      } catch (err) {
        setError('❌ Failed to fetch loan data');
        console.error('Loan fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">📊 Loan Comparison Dashboard</h1>

        {loading && <LoadingSpinner />}
        {error && <p className={theme.errorText}>{error}</p>}

        {!loading && !error && loans.length === 0 && (
          <p className="text-gray-500">No loan data available for comparison.</p>
        )}

        {!loading && !error && loans.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Buyer</th>
                  <th className="p-2 border">Car</th>
                  <th className="p-2 border">Loan Amount</th>
                  <th className="p-2 border">Interest Rate</th>
                  <th className="p-2 border">Term</th>
                  <th className="p-2 border">Monthly Payment</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan._id}>
                    <td className="p-2 border">{loan.buyer?.email || 'N/A'}</td>
                    <td className="p-2 border">{loan.car?.make} {loan.car?.model}</td>
                    <td className="p-2 border">${loan.amount.toLocaleString()}</td>
                    <td className="p-2 border">{loan.interestRate}%</td>
                    <td className="p-2 border">{loan.term} months</td>
                    <td className="p-2 border">${loan.monthlyPayment.toFixed(2)}</td>
                    <td className="p-2 border">{loan.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default LoanComparison;
