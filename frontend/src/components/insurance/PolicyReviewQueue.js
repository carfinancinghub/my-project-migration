// File: PolicyReviewQueue.js
// Path: frontend/src/components/insurance/PolicyReviewQueue.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../admin/layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import Button from '../../common/Button';
import { theme } from '../../styles/theme';

const PolicyReviewQueue = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/insurance/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuotes(res.data);
    } catch (err) {
      setError('❌ Failed to load insurance quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleDecision = async (id, decision) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/insurance/${id}/review`,
        { status: decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuotes((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error('Review update failed:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📋 Policy Review Queue</h1>

        {loading && <LoadingSpinner />}
        {error && <p className={theme.errorText}>{error}</p>}

        {!loading && quotes.length === 0 && (
          <p className="text-gray-500">No pending insurance quotes.</p>
        )}

        {!loading && quotes.length > 0 && (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div key={quote._id} className="border rounded p-4 shadow">
                <p><strong>Policy Type:</strong> {quote.policyType}</p>
                <p><strong>Vehicle ID:</strong> {quote.vehicleId}</p>
                <p><strong>Quote:</strong> ${quote.quoteAmount}</p>
                <p><strong>Submitted By:</strong> {quote.insurer?.email || 'N/A'}</p>
                <div className="mt-4 space-x-2">
                  <Button onClick={() => handleDecision(quote._id, 'Approved')} variant="success">
                    ✅ Approve
                  </Button>
                  <Button onClick={() => handleDecision(quote._id, 'Rejected')} variant="danger">
                    ❌ Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PolicyReviewQueue;
