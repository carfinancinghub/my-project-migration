// File: BuyerProgressBar.jsx
// Path: frontend/src/components/buyer/BuyerProgressBar.jsx
// 👑 Cod1 Crown Certified — Buyer Progress Tracker with Smooth Animations

import React from 'react';

// 🌟 BuyerProgressBar: Tracks Purchase Steps
const BuyerProgressBar = ({ currentStep = 2, totalSteps = 5 }) => {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div>
      {/* Progress Label */}
      <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progressPercent)}%</span>
      </div>

      {/* Progress Background */}
      <div className="w-full bg-gray-200 rounded-full h-4">
        {/* Progress Fill */}
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BuyerProgressBar;
