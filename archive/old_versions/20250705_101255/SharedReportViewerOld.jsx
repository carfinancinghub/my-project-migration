// File: SharedReportViewer.jsx
// Path: frontend/src/components/mechanic/SharedReportViewer.jsx
// Author: Cod1 (05061728)
// Description: Displays a shared mechanic inspection report via secure token URL

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SharedReportViewer = () => {
  const { token } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`/api/mechanic/shared-report/${token}`);
        setReport(res.data);
      } catch (err) {
        setError('Invalid or expired link.');
      }
    };
    fetchReport();
  }, [token]);

  if (error) return <p className="text-red-600">{error}</p>;

  if (!report) return <p>Loading report...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-2">🔍 Shared Inspection Report</h2>
      <p><strong>Vehicle:</strong> {report.vehicle}</p>
      <p><strong>Findings:</strong> {report.summary}</p>
      <p><strong>Tags:</strong> {report.damageTags?.join(', ')}</p>
      <p><strong>Cost Estimate:</strong> ${report.estimatedCost}</p>
      {report.watermark && (
        <p className="text-sm text-gray-400 italic">🔒 Premium Report</p>
      )}
    </div>
  );
};

export default SharedReportViewer;
