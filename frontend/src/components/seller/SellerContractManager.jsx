/**
 * SellerContractManager.jsx
 * Path: frontend/src/components/seller/SellerContractManager.jsx
 * Purpose: Display and manage seller's contracts with download functionality.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Status badge styles
const statusStyles = {
  Signed: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
};

const SellerContractManager = () => {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/seller/contracts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Sort by createdAt descending (newest first)
        const sortedContracts = response.data.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setContracts(sortedContracts);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load contracts');
        setIsLoading(false);
        toast.error('Error loading contracts');
      }
    };
    fetchContracts();
  }, []);

  const handleDownload = async (contractId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/seller/contracts/${contractId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contract_${contractId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Contract downloaded successfully');
    } catch (err) {
      toast.error('Failed to download contract');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Contracts</h1>
        {contracts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No contracts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Car Model</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Buyer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sale Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.contractId} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{contract.carModel}</td>
                    <td className="px-6 py-4">{contract.buyerName}</td>
                    <td className="px-6 py-4">${contract.salePrice.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          statusStyles[contract.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {contract.status === 'Signed' ? '🟢 Signed' : '🟡 Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(contract.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDownload(contract.contractId)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        aria-label={`Download contract for ${contract.carModel}`}
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default SellerContractManager;