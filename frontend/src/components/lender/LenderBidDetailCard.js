// File: LenderBidDetailCard.js
// Path: frontend/src/components/lender/LenderBidDetailCard.js

import React, { useState } from 'react';
import LenderReputationTracker from './LenderReputationTracker';
import Button from '../common/Button';
import { theme } from '../../styles/theme';

const LenderBidDetailCard = ({ bid }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className="border rounded shadow-sm p-4 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Loan ID: {bid.loanId}</p>
          <p className="font-semibold text-lg">Bid Amount: ${bid.amount}</p>
          <p>Status: <span className="font-medium text-blue-600">{bid.status}</span></p>
        </div>
        <Button onClick={toggleExpanded} variant="secondary">
          {expanded ? 'Hide Details' : 'View Details'}
        </Button>
      </div>

      {expanded && (
        <div className="mt-4 border-t pt-4 space-y-3" role="region" aria-label="Bid Details">
          <LenderReputationTracker lenderId={bid.lenderId} />

          <div>
            <h4 className="font-semibold text-sm mb-1">AI Risk Summary</h4>
            <p className="text-gray-700 text-sm">{bid.aiInsights || 'No AI summary available for this bid.'}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-1">Terms Offered</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>Interest Rate: {bid.interestRate}%</li>
              <li>Down Payment: ${bid.downPayment}</li>
              <li>Duration: {bid.termLength} months</li>
            </ul>
          </div>

          <div className="flex gap-4 mt-3">
            <Button variant="success" onClick={() => alert(`Approved bid ${bid._id}`)}>✅ Approve</Button>
            <Button variant="danger" onClick={() => alert(`Rejected bid ${bid._id}`)}>❌ Reject</Button>
            <Button variant="outline" onClick={() => alert('Opening PDF view')}>📄 Export PDF</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LenderBidDetailCard;
