// File: AdminArbitrationDashboard.jsx
// Path: frontend/src/components/admin/arbitration/AdminArbitrationDashboard.jsx
// 👑 Cod1 Crown Certified — Admin Arbitration Manager (Dispute Case Handling)

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx';
import AdminBadgeAuditLog from '@/components/admin/badges/AdminBadgeAuditLog.jsx';

// 🌟 Admin Arbitration Dashboard: Central for Disputes Management
const AdminArbitrationDashboard = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || '';

  // 🔍 Fetch Open Disputes from Backend
  const fetchDisputes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/disputes/open`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDisputes(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching disputes:', err);
      setError('Failed to load open disputes.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  // 📅 Handle Navigate to Dispute Review
  const handleReview = (disputeId) => {
    navigate(`/admin/arbitration/review/${disputeId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-10">{error}</div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Open Arbitration Cases</h1>
        <div className="mb-6">
          <button
            onClick={() => setShowAuditLog(!showAuditLog)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            {showAuditLog ? 'Hide Badge Audit Log' : 'View Badge Audit Log'}
          </button>
        </div>

        {showAuditLog && (
          <div className="mb-6">
            <AdminBadgeAuditLog />
          </div>
        )}

        <div className="grid gap-4">
          {disputes.length > 0 ? disputes.map((dispute) => (
            <div
              key={dispute._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              <h2 className="text-2xl font-semibold mb-2 text-indigo-600">Case: {dispute.caseTitle}</h2>
              <p className="text-gray-700 mb-4">Filed: {new Date(dispute.createdAt).toLocaleDateString()}</p>
              <button
                onClick={() => handleReview(dispute._id)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Review Case
              </button>
            </div>
          )) : (
            <p className="text-gray-600">No open disputes at the moment.</p>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminArbitrationDashboard;
