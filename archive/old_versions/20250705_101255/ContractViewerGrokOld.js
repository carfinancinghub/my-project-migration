// File: ContractViewer.js
// Path: frontend/src/components/contract/ContractViewer.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';
import { theme } from '@/styles/theme';


const ContractViewer = () => {
  const { contractId } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [signing, setSigning] = useState(false);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contracts/${contractId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContract(res.data);
      } catch (err) {
        console.error('Error loading contract:', err);
        setError('❌ Could not load contract.');
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [contractId, token]);

  const handleSign = async () => {
    setSigning(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/contracts/${contractId}/sign`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContract({ ...contract, isSigned: true });
    } catch (err) {
      console.error('Signing failed:', err);
      alert('❌ Signing failed.');
    } finally {
      setSigning(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📄 Contract Details</h1>

      <div className="space-y-2 text-sm">
        <p><strong>Buyer:</strong> {contract.buyer?.email || 'N/A'}</p>
        <p><strong>Lender:</strong> {contract.lender?.email || 'N/A'}</p>
        <p><strong>Status:</strong> {contract.status}</p>
        <p><strong>Signed:</strong> {contract.isSigned ? '✅' : '❌'}</p>
      </div>

      <div className="mt-6">
        {contract.pdfUrl ? (
          <iframe
            src={contract.pdfUrl}
            title="Contract PDF"
            className="w-full h-[80vh] border"
          ></iframe>
        ) : (
          <p className="text-gray-500 italic">No PDF available.</p>
        )}
      </div>

      {!contract.isSigned && (role === 'buyer' || role === 'lender') && (
        <div className="mt-6">
          <Button
            onClick={handleSign}
            disabled={signing}
            aria-label="Sign contract"
          >
            {signing ? 'Signing...' : '🖊️ Sign as ' + role.charAt(0).toUpperCase() + role.slice(1)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContractViewer;
