// 👑 Crown Certified Component — ContractSummary.jsx
// Path: frontend/src/components/contracts/ContractSummary.jsx
// Purpose: Display contract overview, selected bids, and premium insights for buyers, sellers, and admins.
// Author: Rivers Auction Team — May 16, 2025

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ContractOverview from '@/components/common/ContractOverview';
import VersionHistory from '@/components/common/VersionHistory';
import ContractService from '@/services/contracts/ContractService';
import logger from '@/utils/logger';

const ContractSummary = ({ contractId, isPremium }) => {
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState(null);

  useEffect(() => {
    fetchContract();
  }, [contractId, isPremium]);

  const fetchContract = async () => {
    setLoading(true);
    try {
      const response = await ContractService.getContractById(contractId, { includeInsights: isPremium });
      setContract(response?.contract || null);
      if (isPremium) {
        setAiInsights(response?.aiInsights || null);
      }
    } catch (err) {
      logger.error('Failed to load contract summary', err);
      setError('❌ Could not load contract details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500 italic">Loading contract summary...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!contract) {
    return <p className="text-gray-600">No contract data available.</p>;
  }

  return (
    <div className="space-y-6">
      <ContractOverview data={contract} />

      {isPremium && aiInsights && (
        <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 AI Clause Insights</h3>
          <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
            {aiInsights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {isPremium && contract?.versionHistory && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">📜 Version History</h3>
          <VersionHistory history={contract.versionHistory} />
        </div>
      )}
    </div>
  );
};

ContractSummary.propTypes = {
  contractId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default ContractSummary;
