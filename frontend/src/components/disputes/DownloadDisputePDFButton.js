// File: DownloadDisputePDFButton.js
// Path: frontend/src/components/disputes/DownloadDisputePDFButton.js

import React, { useState } from 'react';
import toast from 'react-hot-toast';

const DownloadDisputePDFButton = ({ disputeId, status }) => {
  const [loading, setLoading] = useState(false);

  if (!['resolved', 'escalated'].includes(status)) return null;

  const handleDownload = async () => {
    setLoading(true);
    try {
      const url = `/api/disputes/${disputeId}/export`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Failed to fetch PDF');

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Dispute-${disputeId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('📥 PDF downloaded');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('❌ PDF download failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      disabled={loading}
      aria-label={`Download Dispute ${disputeId} PDF`}
    >
      {loading ? 'Preparing PDF...' : 'Download Dispute PDF'}
    </button>
  );
};

export default DownloadDisputePDFButton;
