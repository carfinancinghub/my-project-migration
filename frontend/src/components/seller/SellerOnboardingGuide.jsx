// File: SellerOnboardingGuide.jsx
// Path: frontend/src/components/seller/SellerOnboardingGuide.jsx
// Purpose: Interactive tutorial modal for new sellers (listing, disputes, badges)
// Author: Cod2 👑
// Date: 2025-04-28
// Status: Cod2 Crown Certified 👑

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const stepsData = [
  {
    title: 'Create Your First Listing',
    description: 'Easily list your car for sale in just a few steps.',
    link: '/seller/create-listing',
    buttonText: 'Start Listing',
  },
  {
    title: 'Understand Disputes',
    description: 'Learn how disputes are handled and resolved fairly.',
    link: '/seller/dispute-center',
    buttonText: 'Learn About Disputes',
  },
  {
    title: 'Earn Badges',
    description: 'Get recognized for your great selling practices!',
    link: '/seller/badges',
    buttonText: 'View Badges',
  },
];

const SellerOnboardingGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const progress = localStorage.getItem('sellerOnboardingCompleted');
    if (!progress) {
      setIsModalOpen(true);
    }
  }, []);

  // Move to next step
  const handleNext = () => {
    if (currentStep < stepsData.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      localStorage.setItem('sellerOnboardingCompleted', 'true');
      setIsModalOpen(false);
      toast.success('Onboarding complete! 🚀');
    }
  };

  // Close modal early
  const handleClose = () => {
    localStorage.setItem('sellerOnboardingCompleted', 'true');
    setIsModalOpen(false);
    toast.info('You can revisit onboarding anytime from your dashboard.');
  };

  if (!isModalOpen) return null;

  const step = stepsData[currentStep];

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-modal-title"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2
            id="onboarding-modal-title"
            className="text-xl font-bold text-gray-800 mb-2 text-center"
          >
            {step.title}
          </h2>
          <p className="text-gray-600 text-center mb-6">{step.description}</p>
          <div className="flex justify-center mb-4">
            <Link
              to={step.link}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              aria-label={step.buttonText}
            >
              {step.buttonText}
            </Link>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleClose}
              className="text-gray-500 hover:underline text-sm"
              aria-label="Skip onboarding"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              aria-label="Next onboarding step"
            >
              {currentStep < stepsData.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

export default SellerOnboardingGuide;
