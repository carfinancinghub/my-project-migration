// File: OnboardingWizard.jsx
// Path: C:\CFH\frontend\src\components\onboarding\OnboardingWizard.jsx
// Purpose: Provide a user onboarding wizard UI
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/onboarding

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { completeProfile } from '@services/api/onboarding';

const OnboardingWizard = ({ userId }) => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      await completeProfile(userId, profileData);
      logger.info(`[OnboardingWizard] Completed onboarding for userId: ${userId}`);
      setStep(3);
    } catch (err) {
      logger.error(`[OnboardingWizard] Failed to complete onboarding for userId ${userId}: ${err.message}`, err);
      setError('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-md mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Welcome to Rivers Auction</h2>
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-gray-600 text-center">Let's set up your profile to get started!</p>
          <button
            onClick={() => setStep(2)}
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Begin Setup
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          {error && <div className="text-center text-red-600 bg-red-100 border border-red-300 rounded-md p-2" role="alert">{error}</div>}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Submit Profile
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4 text-center">
          <p className="text-gray-600">Profile setup complete! You're ready to start bidding.</p>
          <a
            href="/auctions"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Explore Auctions
          </a>
        </div>
      )}
    </div>
  );
};

OnboardingWizard.propTypes = {
  userId: PropTypes.string.isRequired
};

export default OnboardingWizard;