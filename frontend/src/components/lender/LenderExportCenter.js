// File: LenderExportCenter.js
// Path: frontend/src/components/lender/LenderExportCenter.js

import React, { useState } from 'react';
import axios from 'axios';
import Button from '../common/Button';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const LenderExportCenter = () => {
  const [exportLog, setExportLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const token = localStorage.getItem('token');

  const handleExport = async (type, format = 'csv') => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/lender/export/${type}?from=${dateRange.from}&to=${dateRange.to}&format=${format}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setExportLog((prev) => [
        { type, format, from: dateRange.from, to: dateRange.to, timestamp: new Date().toISOString() },
        ...prev,
      ]);
    } catch (err) {
      console.error('Export failed:', err);
      alert('❌ Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📥 Lender Export Center</h1>

      <Card className="p-4 mb-6 space-y-4">
        <h2 className="text-lg font-semibold">Export Filters</h2>
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-sm">From</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="text-sm">To</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold pt-4">Export Data</h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => handleExport('loan-bids', 'csv')}>📄 Export Loan Bids (CSV)</Button>
          <Button onClick={() => handleExport('loan-bids', 'pdf')}>📄 Export Loan Bids (PDF)</Button>
          <Button onClick={() => handleExport('approved-loans', 'csv')}>✅ Export Approved Loans (CSV)</Button>
          <Button onClick={() => handleExport('approved-loans', 'pdf')}>✅ Export Approved Loans (PDF)</Button>
          <Button onClick={() => handleExport('reputation', 'csv')}>🌟 Export Reputation Reviews (CSV)</Button>
          <Button onClick={() => handleExport('reputation', 'pdf')}>🌟 Export Reputation Reviews (PDF)</Button>
        </div>
        {loading && <LoadingSpinner />}
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">📊 Export Log</h2>
        {exportLog.length === 0 ? (
          <p className="text-gray-500">No exports logged yet.</p>
        ) : (
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Type</th>
                <th className="border p-2">Format</th>
                <th className="border p-2">From</th>
                <th className="border p-2">To</th>
                <th className="border p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {exportLog.map((entry, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{entry.type}</td>
                  <td className="border p-2">{entry.format}</td>
                  <td className="border p-2">{entry.from || '—'}</td>
                  <td className="border p-2">{entry.to || '—'}</td>
                  <td className="border p-2">{new Date(entry.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default LenderExportCenter;
