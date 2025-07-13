// File: SharedReportViewer.jsx
// Path: frontend/src/components/mechanic/SharedReportViewer.jsx
// Author: Cod1 (05061705)
// Description: Viewer for shared inspection reports via secure link

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SharedReportViewer = () => {
  const { token } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/mechanic/view-shared-report/${token}`)
      .then(res => setReport(res.data))
      .catch(err => setError('Invalid or expired link.'));
  }, [token]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!report) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">🔍 Shared Inspection Report</h1>
      <p><strong>Vehicle:</strong> {report.vehicle}</p>
      <p><strong>Date:</strong> {new Date(report.date).toLocaleString()}</p>
      <p><strong>Condition:</strong> {report.conditionRating}/5</p>
      <p><strong>Feedback:</strong> {report.notes}</p>
      {report.damageTags?.length > 0 && (
        <p><strong>AI Tags:</strong> {report.damageTags.join(', ')}</p>
      )}
    </div>
  );
};

export default SharedReportViewer;
