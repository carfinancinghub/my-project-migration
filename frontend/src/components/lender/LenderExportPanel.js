// File: LenderExportPanel.js
// Path: frontend/src/components/lender/LenderExportPanel.js

import React, { useState } from 'react';
import axios from 'axios';
import Card from '../common/Card';
import Button from '../common/Button';

const LenderExportPanel = () => {
  const [type, setType] = useState('loan-bids');
  const [format, setFormat] = useState('csv');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [downloading, setDownloading] = useState(false);
  const token = localStorage.getItem('token');

  const handleExport = async () => {
    setDownloading(true);
    try {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      params.append('format', format);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/lender/export/${type}?${params.toString()}`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('❌ Export failed.');
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">📤 Export Lending Data</h2>

      <div>
        <label className="block text-sm font-medium">Data Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border px-2 py-1 rounded">
          <option value="loan-bids">Loan Bids</option>
          <option value="approved-loans">Approved Loans</option>
          <option value="reputation">Lender Reputation</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border px-2 py-1 rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Format</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full border px-2 py-1 rounded">
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
        </select>
      </div>

      <Button onClick={handleExport} disabled={downloading}>
        {downloading ? 'Exporting...' : '📥 Download Export'}
      </Button>
    </Card>
  );
};

export default LenderExportPanel;
