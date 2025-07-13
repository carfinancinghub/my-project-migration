// File: TitleAgentDashboard.js
// Path: frontend/src/components/title/TitleAgentDashboard.js
// Enhanced with AdminLayout, Navbar, Loading/Error States, Actions, and Search

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../admin/layout/AdminLayout';
import Navbar from '../layout/Navbar';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const TitleAgentDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStorageJobs = async () => {
      try {
        const res = await axios.get('/api/title-agent/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
        setFilteredRequests(res.data);
      } catch (err) {
        console.error('Failed to fetch title transfer requests', err);
        setError('❌ Failed to fetch title transfer requests');
      } finally {
        setLoading(false);
      }
    };
    fetchStorageJobs();
  }, [token]);

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearchQuery(val);
    const filtered = requests.filter(request =>
      request.vehicleId?.toLowerCase().includes(val) ||
      request.buyer?.toLowerCase().includes(val) ||
      request.seller?.toLowerCase().includes(val)
    );
    setFilteredRequests(filtered);
  };

  const handleAction = async (id, action) => {
    try {
      await axios.post(`/api/title-agent/requests/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(requests.filter(r => r._id !== id));
      setFilteredRequests(filteredRequests.filter(r => r._id !== id));
    } catch (err) {
      console.error(`Failed to ${action} title transfer request`, err);
      setError(`❌ Failed to ${action} title transfer request`);
    }
  };

  return (
    <AdminLayout>
      <Navbar />
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4">📜 Title Agent Dashboard</h2>

        <Input
          type="text"
          placeholder="Search by vehicle ID, buyer, or seller..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/2"
        />

        {loading && <LoadingSpinner />}
        {error && <p className={theme.errorText}>{error}</p>}

        {!loading && !error && filteredRequests.length === 0 && (
          <p className="text-gray-500">No pending title transfer requests.</p>
        )}

        {!loading && !error && filteredRequests.length > 0 && (
          <div className="grid gap-4">
            {filteredRequests.map((job) => (
              <Card key={job._id} className="p-4 space-y-2">
                <p><strong>Vehicle ID:</strong> {job.vehicleId}</p>
                <p><strong>Buyer:</strong> {job.buyer}</p>
                <p><strong>Seller:</strong> {job.seller}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleAction(job._id, 'approve')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Transfer
                  </Button>
                  <Button
                    onClick={() => handleAction(job._id, 'reject')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reject Transfer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TitleAgentDashboard;