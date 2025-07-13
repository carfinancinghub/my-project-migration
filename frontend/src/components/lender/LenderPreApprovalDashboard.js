// File: LenderPreApprovalDashboard.js
// Path: frontend/src/components/lender/LenderPreApprovalDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';
import { theme } from '../../styles/theme';
import Navbar from '../layout/Navbar';

const LenderPreApprovalDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/lender/preapprovals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setError('❌ Could not load applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token]);

  const handleDecision = async (id, decision) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/lender/preapprovals/${id}/${decision}`,
        { comment: comments[id] || '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(applications.filter((app) => app._id !== id));
    } catch (err) {
      console.error('Decision error:', err);
      alert(`❌ Failed to ${decision} application.`);
    }
  };

  const handleCommentChange = (id, value) => {
    setComments((prev) => ({ ...prev, [id]: value }));
  };

  const handleCSVExport = () => {
    const csvContent = [
      ['Application ID', 'Buyer Email', 'Car', 'Requested Amount', 'Status'].join(',')
    ];
    applications.forEach(app => {
      csvContent.push([
        app._id,
        app.buyer?.email,
        `${app.car?.year} ${app.car?.make} ${app.car?.model}`,
        `$${app.requestedAmount}`,
        app.status
      ].join(','));
    });
    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'preapproval-applications.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const aiRecommend = (application) => {
    if (application.requestedAmount <= 20000) return '✅ Likely safe';
    if (application.requestedAmount > 50000) return '⚠️ High risk';
    return '🔍 Needs manual review';
  };

  const filteredApps = applications.filter(app =>
    app.buyer?.email?.toLowerCase().includes(search.toLowerCase()) ||
    `${app.car?.make} ${app.car?.model}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">📝 Lender Pre-Approval Queue</h1>
          <Button onClick={handleCSVExport} variant="outline">⬇️ Export CSV</Button>
        </div>

        <input
          type="text"
          placeholder="Search buyer or car..."
          className="border p-2 rounded mb-4 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <LoadingSpinner />}
        {error && <p className={theme.errorText}>{error}</p>}

        {!loading && !error && filteredApps.length === 0 && (
          <p className="text-gray-500">No matching applications found.</p>
        )}

        <div className="grid gap-4">
          {filteredApps.map((app) => (
            <div key={app._id} className="border rounded shadow p-4 bg-white">
              <p><strong>Application ID:</strong> {app._id}</p>
              <p><strong>Buyer:</strong> {app.buyer?.email}</p>
              <p><strong>Car:</strong> {app.car?.year} {app.car?.make} {app.car?.model}</p>
              <p><strong>Requested Amount:</strong> ${app.requestedAmount}</p>
              <p><strong>Status:</strong> {app.status}</p>
              <p><strong>🧠 AI Suggestion:</strong> {aiRecommend(app)}</p>

              <textarea
                className="w-full border rounded p-2 mt-3"
                rows="3"
                placeholder="Internal notes (optional)"
                value={comments[app._id] || ''}
                onChange={(e) => handleCommentChange(app._id, e.target.value)}
              />

              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => handleDecision(app._id, 'approve')}>✅ Approve</Button>
                <Button onClick={() => handleDecision(app._id, 'reject')} variant="danger">❌ Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LenderPreApprovalDashboard;
