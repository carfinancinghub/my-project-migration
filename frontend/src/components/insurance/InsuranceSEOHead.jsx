/**
 * @file InsuranceSEOHead.jsx
 * @path frontend/src/components/insurance/InsuranceSEOHead.jsx
 * @description Injects SEO metadata for insurance policies, including dynamic OpenGraph tags, JSON-LD schema, and multilingual support for optimal discoverability and premium branding.
 * @author Cod2
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { injectMetaTags, injectOpenGraph, injectJsonLD } from '@utils/SocialShareHelper';
import { useConfetti } from '@utils/ConfettiHelper';
import OnboardingGuide from '@components/onboarding/OnboardingGuide';
import ToastManager from '@components/common/ToastManager';
import '@styles/InsuranceSEOHead.css';

/**
 * @component InsuranceSEOHead
 * @description React component to inject SEO metadata dynamically for insurance policy pages.
 */
const InsuranceSEOHead = ({ title }) => {
  const location = useLocation();
  const policyId = new URLSearchParams(location.search).get('policyId');
  const { triggerConfetti } = useConfetti();

  /**
   * @function getSEOMetadata
   * @description Fetches metadata from the insurance SEO route.
   * @param {string} id - Policy ID
   */
  const getSEOMetadata = async (id) => {
    try {
      const res = await axios.get(`/api/insurance/metadata/${id}`);
      const meta = res.data;
      injectMetaTags(meta);
      injectOpenGraph(meta);
      injectJsonLD(meta);
      if (meta.premium) triggerConfetti(); // @wow Confetti on premium metadata update
    } catch (err) {
      ToastManager.error('Failed to fetch SEO metadata');
      console.error('SEO metadata error', err);
    }
  };

  useEffect(() => {
    if (policyId) getSEOMetadata(policyId);
    else injectMetaTags({ title });
  }, [policyId, title]);

  return (
    <div data-testid="seo-head" aria-hidden="true">
      <OnboardingGuide feature="insurance-seo" />
    </div>
  );
};

InsuranceSEOHead.propTypes = {
  title: PropTypes.string.isRequired,
};

export default InsuranceSEOHead;
