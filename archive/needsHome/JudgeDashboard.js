// File: JudgeDashboard.js
// Path: frontend/src/components/judge/JudgeDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';
import Card from '../common/Card';
import Button from '../common/Button';
import Navbar from '../layout/Navbar';

const JudgeDashboard = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/disputes/judge`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDisputes(res.data);
      } catch (err) {
        console.error('Error fetching disputes:', err);
        setError('❌ Failed to load disputes');
      } finally {
        setLoading(false);
      }
    };
    fetchDisputes();
  }, [token]);

  const handleVote = async (disputeId, vote) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/disputes/${disputeId}/vote`, { vote }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDisputes(disputes.filter(d => d._id !== disputeId));
    } catch (err) {
      console.error('Vote failed:', err);
      alert('Failed to record vote. Please try again.');
    }
  };

  return (
    <ErrorBoundary>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">⚖️ Judge Panel – Active Disputes</h1>

        {loading && <LoadingSpinner />}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && disputes.length === 0 && (
          <p className="text-gray-500">No disputes to review at the moment.</p>
        )}

        {!loading && !error && disputes.length > 0 && (
          <div className="grid gap-4">
            {disputes.map(dispute => (
              <Card key={dispute._id} className="bg-white">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{dispute.type}</h3>
                  <p><strong>Description:</strong> {dispute.description}</p>
                  <p><strong>Buyer:</strong> {dispute.buyer?.email}</p>
                  <p><strong>Seller:</strong> {dispute.seller?.email}</p>
                  <div className="mt-2 space-x-2">
                    <Button onClick={() => handleVote(dispute._id, 'approve')} variant="success">✅ Approve</Button>
                    <Button onClick={() => handleVote(dispute._id, 'reject')} variant="danger">❌ Reject</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default JudgeDashboard;
