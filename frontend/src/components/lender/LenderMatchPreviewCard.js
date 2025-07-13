// File: LenderMatchPreviewCard.js
// Path: frontend/src/components/lender/LenderMatchPreviewCard.js
// 👑 Cod1 Crown Certified — Enhanced with Bonus Disruption Features

import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const LenderMatchPreviewCard = ({ lender }) => {
  return (
    <Card className="p-4 space-y-3 border shadow hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">
          {lender.companyName}{' '}
          {lender.isVerified && <FaCheckCircle className="inline text-green-500 ml-1" title="Verified Lender" />}
        </h3>
        {lender.aiBoosted && <span className="text-sm bg-purple-100 text-purple-600 px-2 py-1 rounded-full">🤖 AI Boosted</span>}
      </div>

      <div className="text-sm text-gray-600">
        <p>
          <strong>Interest Rate:</strong> {lender.interestRateRange}%
        </p>
        <p>
          <strong>Max Loan:</strong> ${lender.maxLoanAmount.toLocaleString()}
        </p>
        <p>
          <strong>Rating:</strong> {lender.rating}/5 ⭐
        </p>
        <p>
          <strong>Specialties:</strong> {lender.tags?.join(', ') || 'N/A'}
        </p>
        <p>
          <strong>Match Score:</strong> {lender.matchScore}%
          <FaInfoCircle
            className="inline ml-1 text-blue-400 cursor-pointer"
            title="Match Score reflects compatibility based on your preferences, loan need, and risk profile."
          />
        </p>
        <p>
          <strong>Status:</strong> {lender.isOnline ? '🟢 Active Now' : '🕓 Responds Quickly'}
        </p>
      </div>

      <div className="text-right">
        <Button onClick={() => alert(`Opening full profile for ${lender.companyName}`)}>
          💰 View & Bid
        </Button>
      </div>

      <div className="text-xs text-gray-400 text-right">
        <button
          className="underline hover:text-blue-500"
          onClick={() => window.open(`/api/lenders/${lender._id}/export-pdf`, '_blank')}
        >
          📄 Export PDF
        </button>
      </div>
    </Card>
  );
};

export default LenderMatchPreviewCard;
