// File: AdminDisputeDashboard.jsx
// Path: frontend/src/components/admin/disputes/AdminDisputeDashboard.jsx
// Purpose: Admin dashboard for reviewing disputes with multilingual PDF export
// Author: Cod2
// Date: 2025-05-01
// 👑 Cod2 Crown Certified

import React\nimport SEOHead from '@components/common/SEOHead';, { useState, useEffect } from 'react';
import axios from 'axios';
import PremiumFeature from '@components/common/PremiumFeature';
import MultiLanguageSupport from '@components/common/MultiLanguageSupport';
import { toast } from 'react-toastify';
import LoadingSpinner from '@components/common/LoadingSpinner';

const AdminDisputeDashboard = () => {
  const [disputes, setDisputes] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await axios.get('/api/disputes');
        setDisputes(response.data);
      } catch (error) {
        toast.error('Failed to fetch disputes');
      }
    };
    fetchDisputes();
  }, []);

  const handleExportPDF = async (disputeId) => {
    try {
      setExporting(true);
      const response = await axios.get(`/api/disputes/${disputeId}/export`, {
        params: { lang: selectedLanguage },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dispute_${disputeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dispute Dashboard</h1>
      <PremiumFeature feature="multilingual">
        <div className="mb-4">
          <label htmlFor="language-select" className="mr-2 font-medium">
            Select Language:
          </label>
          <select
            id="language-select"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </PremiumFeature>
      {disputes.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Dispute ID</th>
              <th className="py-2 px-4 border-b">Buyer</th>
              <th className="py-2 px-4 border-b">Seller</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((dispute) => (
              <tr key={dispute._id}>
                <td className="py-2 px-4 border-b">{dispute._id}</td>
                <td className="py-2 px-4 border-b">{dispute.buyerId}</td>
                <td className="py-2 px-4 border-b">{dispute.sellerId}</td>
                <td className="py-2 px-4 border-b">{dispute.status}</td>
                <td className="py-2 px-4 border-b">
                  <PremiumFeature feature="multilingual">
                    <button
                      onClick={() => handleExportPDF(dispute._id)}
                      className={`bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-300 ${
                        exporting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={exporting}
                    >
                      {exporting ? 'Exporting...' : 'Export PDF'}
                    </button>
                  </PremiumFeature>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDisputeDashboard;

