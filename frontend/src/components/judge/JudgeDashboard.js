// File: JudgeDashboard.js
// Path: frontend/src/components/judge/JudgeDashboard.js
// Updated with AdminLayout, Search Functionality, Detailed View Modal, and Escalation History

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../admin/layout/AdminLayout';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Navbar from '../layout/Navbar';

const JudgeDashboard = () => {
  const [disputes, setDisputes] = useState([]);
  const [filteredDisputes, setFilteredDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/disputes/judge`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDisputes(res.data);
        setFilteredDisputes(res.data);
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setDisputes(disputes.filter(d => d._id !== disputeId));
      setFilteredDisputes(filteredDisputes.filter(d => d._id !== disputeId));
      setSelectedDispute(null);
    } catch (err) {
      console.error('Vote failed:', err);
      alert('Failed to record vote. Please try again.');
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearchQuery(val);
    const filtered = disputes.filter(d =>
      d.type?.toLowerCase().includes(val) ||
      d.buyer?.email?.toLowerCase().includes(val) ||
      d.seller?.email?.toLowerCase().includes(val)
    );
    setFilteredDisputes(filtered);
  };

  return (
    <AdminLayout>
      <ErrorBoundary>
        <Navbar />
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold mb-4">⚖️ Judge Panel – Active Disputes</h1>

          <Input
            type="text"
            placeholder="Search by type, buyer, or seller..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full md:w-1/2"
          />

          {loading && <LoadingSpinner />}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && filteredDisputes.length === 0 && (
            <p className="text-gray-500">No disputes to review at the moment.</p>
          )}

          {!loading && !error && filteredDisputes.length > 0 && (
            <div className="grid gap-4">
              {filteredDisputes.map(dispute => (
                <Card key={dispute._id} className="bg-white">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{dispute.type}</h3>
                    <p><strong>Description:</strong> {dispute.description}</p>
                    <p><strong>Buyer:</strong> {dispute.buyer?.email}</p>
                    <p><strong>Seller:</strong> {dispute.seller?.email}</p>
                    <div className="mt-2 space-x-2">
                      <Button onClick={() => handleVote(dispute._id, 'approve')} variant="success">✅ Approve</Button>
                      <Button onClick={() => handleVote(dispute._id, 'reject')} variant="danger">❌ Reject</Button>
                      <Button onClick={() => setSelectedDispute(dispute)} variant="secondary">🔍 View Details</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Detailed View Modal */}
          {selectedDispute && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Dispute Details</h3>
                <p><strong>Type:</strong> {selectedDispute.type}</p>
                <p><strong>Description:</strong> {selectedDispute.description}</p>
                <p><strong>Buyer:</strong> {selectedDispute.buyer?.email}</p>
                <p><strong>Seller:</strong> {selectedDispute.seller?.email}</p>
                {/* Escalation History (Placeholder for Arbitration Votes) */}
                <div className="mt-4">
                  <h4 className="text-md font-semibold">Escalation History</h4>
                  {selectedDispute.votes?.length > 0 ? (
                    <ul className="text-sm list-disc ml-5 text-gray-700">
                      {selectedDispute.votes.map((vote, idx) => (
                        <li key={idx}>{vote.arbitratorId}: {vote.vote} (Timestamp: {new Date(vote.timestamp).toLocaleString()})</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No prior arbitration votes recorded.</p>
                  )}
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <Button onClick={() => setSelectedDispute(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Close</Button>
                  <Button onClick={() => handleVote(selectedDispute._id, 'approve')} variant="success">✅ Approve</Button>
                  <Button onClick={() => handleVote(selectedDispute._id, 'reject')} variant="danger">❌ Reject</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default JudgeDashboard;