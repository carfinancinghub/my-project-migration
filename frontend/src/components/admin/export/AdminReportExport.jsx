// File: AdminReportExport.js
// Path: frontend/src/components/AdminReportExport.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AdminReportExport = () => {
  const [exportUrl, setExportUrl] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const handleExport = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/export/reports`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      setExportUrl(url);
    } catch (err) {
      console.error('Export failed:', err);
      setError('❌ Failed to generate export file');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📦 Admin Report Export</h1>
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={generating}
        >
          {generating ? 'Generating...' : 'Download Report ZIP'}
        </button>

        {error && <p className="text-red-600 mt-3">{error}</p>}

        {exportUrl && (
          <p className="mt-4">
            ✅ Export ready.{' '}
            <a href={exportUrl} download="admin-reports.zip" className="text-blue-600 underline">
              Click here to download
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminReportExport;
