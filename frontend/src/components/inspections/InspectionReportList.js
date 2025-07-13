// File: InspectionReportList.js
// Path: frontend/src/components/inspections/InspectionReportList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';

const InspectionReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/inspection/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(res.data);
      } catch (err) {
        setError('❌ Failed to load inspection reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <ErrorBoundary>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">🔎 All Inspection Reports</h1>

        {loading && <LoadingSpinner />}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && reports.length === 0 && (
          <p className="text-gray-500">No inspection reports found.</p>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Vehicle</th>
                  <th className="p-2 border">Inspector</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Submitted</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id}>
                    <td className="p-2 border">{r.vehicleId || 'N/A'}</td>
                    <td className="p-2 border">{r.mechanic?.email || 'Unassigned'}</td>
                    <td className="p-2 border">{r.status || 'Unknown'}</td>
                    <td className="p-2 border">{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : 'Not submitted'}</td>
                    <td className="p-2 border space-x-2">
                      <Link
                        to={`/inspection/view/${r._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                      <a
                        href={`${process.env.REACT_APP_API_URL}/api/inspection/pdf/${r._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default InspectionReportList;
