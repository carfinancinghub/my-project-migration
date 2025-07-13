/**
 * BuyerOnboardingGuide.jsx
 * Path: frontend/src/components/buyer/BuyerOnboardingGuide.jsx
 * Purpose: Interactive onboarding tutorial for new buyers with localStorage progress tracking.
 * Author: Cod2 👑
 * Date: 2025-04-28
 * Status: Cod2 Crown Certified 👑
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import PropTypes from 'prop-types';

const onboardingSteps = [
  { id: 1, title: 'Browse Cars', description: 'Search and explore available cars that fit your preferences.' },
  { id: 2, title: 'Set Preferences', description: 'Update your Buyer Preferences to get personalized suggestions.', link: '/buyer/preferences' },
  { id: 3, title: 'Get Financing', description: 'Apply for financing and compare loan offers.' },
  { id: 4, title: 'Secure Escrow', description: 'Complete your purchase safely through our escrow services.' },
  { id: 5, title: 'Confirm Delivery', description: 'Track and confirm the delivery of your new vehicle.' },
];

const BuyerOnboardingGuide = ({ buyerId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedStep = parseInt(localStorage.getItem(`buyerOnboardingStep_${buyerId}`), 10);
    if (!isNaN(savedStep)) {
      setCurrentStep(savedStep);
    }
  }, [buyerId]);

  // Save progress to localStorage whenever step changes
  useEffect(() => {
    localStorage.setItem(`buyerOnboardingStep_${buyerId}`, currentStep);
  }, [buyerId, currentStep]);

  // Open the onboarding modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Close the onboarding modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Move to the next onboarding step
  const handleNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep((prev) => prev +
