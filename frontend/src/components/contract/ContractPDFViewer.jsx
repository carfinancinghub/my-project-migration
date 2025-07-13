// File: ContractPDFViewer.js
// Path: frontend/src/components/contract/ContractPDFViewer.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { theme } from '@/styles/theme';


const ContractPDFViewer = () => {
  const { contractId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contracts/${contractId}/pdf`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPdfUrl(res.data.pdfUrl);
      } catch (err) {
        console.error('PDF fetch error:', err);
        setError('❌ Failed to load contract PDF.');
      } finally {
        setLoading(false);
      }
    };

    if (contractId) fetchPdfUrl();
  }, [contractId, token]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;
  if (!pdfUrl) return <p className="text-gray-500">No PDF available for this contract.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📄 Contract PDF Viewer</h1>
      <iframe
        src={pdfUrl}
        title="Contract PDF"
        className="w-full h-[80vh] border rounded shadow"
      ></iframe>
    </div>
  );
};

export default ContractPDFViewer;
