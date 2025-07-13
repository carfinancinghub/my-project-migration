// File: BuyerProgressBar.js
// Path: frontend/src/components/buyer/BuyerProgressBar.js
// 👑 Cod1 Crown Certified — Buyer Deal Tracker Progress Bar with Milestone Icons + ARIA

import React from 'react';
import PropTypes from 'prop-types';

const steps = [
  { key: 'interest', label: 'Interest', icon: '🔍' },
  { key: 'bid', label: 'Bid Placed', icon: '💲' },
  { key: 'loan', label: 'Loan Approved', icon: '💳' },
  { key: 'inspection', label: 'Inspection', icon: '🚗' },
  { key: 'delivery', label: 'Delivered', icon: '🎉' },
];

const BuyerProgressBar = ({ currentStep }) => {
  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between bg-white border p-4 rounded shadow"
      role="progressbar"
      aria-valuenow={currentIndex + 1}
      aria-valuemin={1}
      aria-valuemax={steps.length}
    >
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;
        return (
          <div key={step.key} className="flex flex-col items-center text-center w-full">
            <div
              className={`rounded-full w-10 h-10 flex items-center justify-center text-lg mb-2 ${
                isActive ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step.icon}
            </div>
            <p
              className={`text-sm font-medium ${
                isActive ? 'text-green-700' : 'text-gray-500'
              }`}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

BuyerProgressBar.propTypes = {
  currentStep: PropTypes.oneOf(steps.map((s) => s.key)).isRequired,
};

export default BuyerProgressBar;
