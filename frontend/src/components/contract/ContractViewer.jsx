// File: ContractViewer.js
// Path: frontend/src/components/contract/ContractViewer.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';
import { theme } from '@/styles/theme';
import Navbar from '@/components/common/Navbar';

const ContractViewer = () => {
  const { contractId } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/contracts/${contractId}`);
        setContract(res.data);
      } catch (err) {
        console.error('Failed to fetch contract:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [contractId]);

  if (loading) return <LoadingSpinner />;

  if (!contract) return <p className={theme.errorText}>❌ Contract not found.</p>;

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">📄 Contract Details</h1>
        <pre className="bg-white p-4 rounded shadow overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(contract, null, 2)}
        </pre>
        <Button onClick={() => window.print()} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
          🖨️ Print Contract
        </Button>
      </div>
    </div>
  );
};

export default ContractViewer;
