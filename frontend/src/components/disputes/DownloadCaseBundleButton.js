// File: DownloadCaseBundleButton.js
// Path: frontend/src/components/disputes/DownloadCaseBundleButton.js

import React, { useState } from 'react';
import toast from 'react-hot-toast';

const DownloadCaseBundleButton = ({ disputeId }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/disputes/${disputeId}/export/bundle`);
      if (!response.ok) throw new Error('Bundle not available');

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `CaseBundle-${disputeId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('📦 ZIP bundle downloaded');
    } catch (err) {
      console.error('Download bundle error:', err);
      toast.error('❌ Failed to download ZIP bundle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      aria-label={`Download ZIP bundle for Dispute ${disputeId}`}
    >
      {loading ? 'Bundling...' : 'Download ZIP Bundle'}
    </button>
  );
};

export default DownloadCaseBundleButton;
