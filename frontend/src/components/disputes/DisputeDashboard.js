// File: DisputeDashboard.js
// Path: frontend/src/components/disputes/DisputeDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from './layout/AdminLayout';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorBoundary from './common/ErrorBoundary';
import Card from './common/Card';
import Button from './common/Button';
import { theme } from './styles/theme';
import DownloadDisputePDFButton from './disputes/DownloadDisputePDFButton';
import DownloadCaseBundleButton from './disputes/DownloadCaseBundleButton';
import JudgeBadgeRenderer from './disputes/JudgeBadgeRenderer';
import DisputeEvidenceUploader from './disputes/DisputeEvidenceUploader';

const DisputeDashboard = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/disputes`, {
          headers: { Authorization: `Bearer ${token}` },
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
  }, []);

  const handleAssignModerators = async (disputeId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/disputes/${disputeId}/assign-moderators`,
        { numModerators: 3 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/disputes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDisputes(res.data);
    } catch (err) {
      setError('❌ Failed to assign moderators');
    }
  };

  const handleResolve = async (disputeId, resolution) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/disputes/${disputeId}/resolve`,
        { resolution },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/disputes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDisputes(res.data);
    } catch (err) {
      setError('❌ Failed to resolve dispute');
    }
  };

  const filteredDisputes = disputes.filter((dispute) =>
    filter === 'all' ? true : dispute.status === filter
  );

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">🛡️ Dispute Dashboard</h1>

          <div className="flex space-x-4 mb-4">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              onClick={() => setFilter('all')}
              aria-label="Show all disputes"
            >
              All
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'secondary'}
              onClick={() => setFilter('pending')}
              aria-label="Show pending disputes"
            >
              Pending
            </Button>
            <Button
              variant={filter === 'resolved' ? 'primary' : 'secondary'}
              onClick={() => setFilter('resolved')}
              aria-label="Show resolved disputes"
            >
              Resolved
            </Button>
          </div>

          {loading && <LoadingSpinner />}
          {error && <p className={theme.errorText}>{error}</p>}

          {!loading && !error && filteredDisputes.length === 0 && (
            <p className="text-gray-500">No disputes found.</p>
          )}

          {!loading && !error && filteredDisputes.length > 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              role="grid"
              aria-label="Disputes"
            >
              {filteredDisputes.map((dispute) => (
                <Card key={dispute._id} className="hover:shadow-md">
                  <div className="space-y-2" role="gridcell">
                    <p className="text-sm text-gray-600">Dispute ID</p>
                    <p className="text-xl font-semibold">{dispute._id}</p>
                    <p className="text-sm text-gray-600">Parties</p>
                    <p className="text-xl font-semibold">{dispute.parties}</p>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-xl font-semibold">{dispute.status}</p>

                    {dispute.status === 'pending' && (
                      <Button
                        variant="primary"
                        onClick={() => handleAssignModerators(dispute._id)}
                        aria-label={`Assign moderators to dispute ${dispute._id}`}
                      >
                        Assign Moderators
                      </Button>
                    )}
                    {dispute.status === 'pending' && (
                      <Button
                        variant="secondary"
                        onClick={() => handleResolve(dispute._id, 'Manually Resolved')}
                        aria-label={`Resolve dispute ${dispute._id}`}
                      >
                        Resolve Manually
                      </Button>
                    )}

                    <div className="flex gap-2 flex-wrap border rounded p-2 bg-gray-50">
                      <DownloadDisputePDFButton disputeId={dispute._id} status={dispute.status} />
                      <DownloadCaseBundleButton disputeId={dispute._id} />
                      {(dispute.userRole === 'admin' || dispute.userRole === 'judge') && <DisputeEvidenceUploader disputeId={dispute._id} />}
                    </div>

                    {dispute.arbitrationStats?.badges?.length > 0 && (
                      <JudgeBadgeRenderer badges={dispute.arbitrationStats.badges} />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default DisputeDashboard;
