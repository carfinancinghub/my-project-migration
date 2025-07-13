// File: BuyerFinancingModal.jsx
// Path: frontend/src/components/buyer/BuyerFinancingModal.jsx
// Purpose: Buyer modal to display equity-optimized financing with blockchain audit trail + Wow++ gamification
// Author: Cod1 (05101340 - PDT)
// Editor: Cod1 (05140415 - PDT) — Added Wow++ gamification features
// 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { runEquityOptimizedFinancingMatch } from '@services/ai/FinancingOptimizer';
import BlockchainTrailViewer from '@components/blockchain/BlockchainTrailViewer';
import FinancingProgressTracker from '@components/common/FinancingProgressTracker';
import AIFinancingAdvisor from '@components/common/AIFinancingAdvisor';

/**
 * 🧠 Functions Summary:
 * - runEquityOptimizedFinancingMatch(auctionId): Calls AI module to fetch financing options.
 * - renderBlockchainFinancingTrail(id): Renders blockchain audit viewer for transparency.
 * - renderWowGamificationTools(): Renders financing badge tracker and AI advisor (premium tools).
 * Inputs:
 * - auctionId (string): The auction the user is seeking financing for
 * - isPremium (bool): Whether the user has access to premium gamified tools
 * - userId (string): User context for progress tracker
 * Outputs: JSX displaying financing results and optional gamified tools
 * Dependencies: @services/ai/FinancingOptimizer, @components/blockchain/BlockchainTrailViewer, @components/common/*
 */

const BuyerFinancingModal = ({ auctionId, isPremium, userId }) => {
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

  const renderBlockchainFinancingTrail = (id) => {
    try {
      return <BlockchainTrailViewer trailId={id} />;
    } catch (error) {
      logger.error('Failed to render blockchain financing trail:', error);
      setTrailError('Unable to load blockchain trail.');
      return <div className="text-red-500">Blockchain trail unavailable</div>;
    }
  };

  const renderWowGamificationTools = () => {
    if (!isPremium) return (
      <div className="mt-6 p-3 text-sm bg-yellow-50 border border-yellow-300 rounded">
        Premium gamification features are available with an upgrade.
      </div>
    );

    return (
      <div className="mt-6 space-y-4">
        <FinancingProgressTracker userId={userId} />
        <AIFinancingAdvisor auctionId={auctionId} />
      </div>
    );
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

      {renderWowGamificationTools()}
    </div>
  );
};

BuyerFinancingModal.propTypes = {
  auctionId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
};

export default BuyerFinancingModal;