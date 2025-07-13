// File: EscrowOfficerPremiumPanel.jsx
// Path: frontend/src/components/escrow/EscrowOfficerPremiumPanel.jsx
// Author: Cod2 (05071958)
// Description: Officer UI for blockchain export, PDF proof, and advanced tools

import React from 'react';
import { generateHash } from '@/utils/escrow/EscrowBlockchainExporter';
import PremiumFeature from '@/components/common/PremiumFeature';

const EscrowOfficerPremiumPanel = ({ transaction }) => {
  const handleExportHash = () => {
    const hash = generateHash(transaction);
    alert(`Blockchain Hash: ${hash}`);
  };

  return (
    <PremiumFeature feature="escrowPremium">
      <div className="p-4 border rounded bg-gray-50">
        <h3 className="font-bold mb-2">🔒 Premium Tools</h3>
        <button onClick={handleExportHash} className="btn btn-sm bg-indigo-600 text-white">
          Generate Blockchain Hash
        </button>
      </div>
    </PremiumFeature>
  );
};

export default EscrowOfficerPremiumPanel;
