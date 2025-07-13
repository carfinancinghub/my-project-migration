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
  cons// File: InspectionReportViewerPage.js
// Path: frontend/src/components/inspections/InspectionReportViewerPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';
import Button from '../../common/Button';
import Navbar from '../Navbar';

const InspectionReportViewerPage = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/inspection/reports/${reportId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReport(res.data);
      } catch (err) {
        console.error('Failed to fetch report:', err);
        setError('❌ Unable to load inspection report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId, token]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600 p-4">{error}</p>;
  if (!report) return <p className="text-gray-500 p-4">No report found</p>;

  return (
    <ErrorBoundary>
      <Navbar />
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🛠️ Inspection Report Detail</h1>

        <div className="bg-white p-4 rounded shadow">
          <p><strong>Vehicle:</strong> {report.vehicleMake} {report.vehicleModel} ({report.vehicleYear})</p>
          <p><strong>Mechanic:</strong> {report.mechanic?.email || 'Unknown'}</p>
          <p><strong>Status:</strong> {report.status}</p>
          <p><strong>Reported At:</strong> {new Date(report.createdAt).toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded shadow space-y-4">
          <h2 className="text-lg font-semibold">Inspection Notes</h2>
          <p>{report.notes}</p>

          {report.voiceNoteUrl && (
            <div>
              <h3 className="font-medium text-sm">🎙️ Voice Note</h3>
              <audio controls src={report.voiceNoteUrl} className="mt-2" />
            </div>
          )}

          {report.photos && report.photos.length > 0 && (
            <div>
              <h3 className="font-medium text-sm mb-1">📷 Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {report.photos.map((url, index) => (
                  <img key={index} src={url} alt={`Photo ${index + 1}`} className="rounded border" />
                ))}
              </div>
            </div>
          )}

          {report.tags && report.tags.length > 0 && (
            <div>
              <h3 className="font-medium text-sm">🏷️ Tags</h3>
              <ul className="list-disc ml-6 text-sm">
                {report.tags.map((tag, i) => <li key={i}>{tag}</li>)}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <Button onClick={() => window.open(`${process.env.REACT_APP_API_URL}/api/inspection/pdf/${report._id}`, '_blank')}>
              📄 Download PDF Report
            </Button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default InspectionReportViewerPage;
t token = localStorage.getItem('token');

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
