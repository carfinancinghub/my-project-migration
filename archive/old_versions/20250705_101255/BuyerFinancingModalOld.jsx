// File: BuyerFinancingModal.jsx
// Path: frontend/src/components/buyer/BuyerFinancingModal.jsx
// Purpose: Buyer modal to display equity-optimized financing with blockchain audit trail
// Author: Cod1 (05101340 - PDT)
// 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { runEquityOptimizedFinancingMatch } from '@services/ai/FinancingOptimizer';
import BlockchainTrailViewer from '@components/blockchain/BlockchainTrailViewer';

/**
 * Functions Summary:
 * - runEquityOptimizedFinancingMatch(auctionId): Calls AI module to fetch financing options.
 * - renderBlockchainFinancingTrail(id): Renders blockchain audit viewer for transparency.
 * Inputs: auctionId (string)
 * Outputs: JSX displaying financing and blockchain data
 * Dependencies: @services/ai/FinancingOptimizer, @components/blockchain/BlockchainTrailViewer
 */
const BuyerFinancingModal = ({ auctionId }) => {
  const [financingOptions, setFinancingOptions] = useState([]);
  const [financingError, setFinancingError] = useState(null);
  const [trailError, setTrailError] = useState(null);

  useEffect(() => {
    const fetchFinancing = async () => {
      try {
        const matches = await runEquityOptimizedFinancingMatch(auctionId);
        setFinancingOptions(matches);
      } catch (error) {
        logger.error('Failed to run equity-optimized financing match:', error);
        setFinancingError('Failed to load financing options');
      }
    };

    if (auctionId) fetchFinancing();
  }, [auctionId]);

  /**
   * @param {string} id - Blockchain record identifier
   */
  const renderBlockchainFinancingTrail = (id) => {
    try {
      return <BlockchainTrailViewer trailId={id} />;
    } catch (error) {
      logger.error('Failed to render blockchain financing trail:', error);
      setTrailError('Unable to load blockchain trail.');
      return <div>Blockchain trail unavailable</div>;
    }
  };

  if (!auctionId) return <div>Invalid auction ID</div>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Financing Options</h2>
      {financingError ? (
        <div className="text-red-600">{financingError}</div>
      ) : financingOptions.length === 0 ? (
        <div>Loading options...</div>
      ) : (
        <ul className="space-y-4">
          {financingOptions.map((option, index) => (
            <li key={index}>
              <div>{option.lender} - {option.rate}% APR</div>
              {renderBlockchainFinancingTrail(option.blockchainId)}
            </li>
          ))}
        </ul>
      )}
      {trailError && <div className="text-red-600 mt-2">{trailError}</div>}
    </div>
  );
};

BuyerFinancingModal.propTypes = {
  auctionId: PropTypes.string.isRequired,
};

export default BuyerFinancingModal;