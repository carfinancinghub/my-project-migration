// File: InspectionReportViewer.js
// Path: frontend/src/components/mechanic/InspectionReportViewer.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import Card from '../common/Card';
import Button from '../common/Button';
import { theme } from '../../styles/theme';

const InspectionReportViewer = ({ reportId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/inspection/reports/${reportId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReport(res.data);
      } catch (err) {
        setError('❌ Failed to load inspection report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;
  if (!report) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Inspection Report</h1>

      <Card>
        <div className="space-y-2">
          <p><strong>Vehicle:</strong> {report.car?.make} {report.car?.model} ({report.car?.year})</p>
          <p><strong>Mechanic:</strong> {report.mechanic?.email}</p>
          <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> {report.status}</p>

          {report.notes && (
            <div>
              <p className="font-medium mt-4">Inspection Notes:</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.notes}</p>
            </div>
          )}

          {report.aiTags?.length > 0 && (
            <div className="mt-4">
              <p className="font-medium">AI Tags:</p>
              <div className="flex flex-wrap gap-2">
                {report.aiTags.map((tag, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {report.photos?.length > 0 && (
            <div className="mt-4">
              <p className="font-medium mb-2">Photos:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {report.photos.map((url, i) => (
                  <img key={i} src={url} alt={`Inspection ${i}`} className="w-full rounded shadow" />
                ))}
              </div>
            </div>
          )}

          {report.attachments?.length > 0 && (
            <div className="mt-4">
              <p className="font-medium mb-2">Attachments:</p>
              <ul className="list-disc pl-6">
                {report.attachments.map((file, i) => (
                  <li key={i}><a href={file.url} className="text-blue-600 underline" download>{file.name}</a></li>
                ))}
              </ul>
            </div>
          )}

          {(role === 'escrow' || role === 'lender' || role === 'insurer') && (
            <div className="mt-6 flex gap-4">
              <Button variant="success" onClick={() => alert('Approved ✅')}>Approve Report</Button>
              <Button variant="danger" onClick={() => alert('Flagged ❌')}>Flag for Review</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InspectionReportViewer;
