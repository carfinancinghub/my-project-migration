/**
 * File: SEOHead.jsx
 * Path: frontend/src/components/common/SEOHead.jsx
 * Purpose: Generic SEO component to set metadata for dashboards
 * Author: Rivers Auction Team
 * Date: May 25, 2025
 * 👑 Crown Certified
 * Features:
 * - Sets page title, description, and keywords for SEO optimization
 * - Supports Open Graph and Twitter Card metadata for social sharing
 * - Ensures accessibility with proper meta tags
 * Functions:
 * - Sets document metadata using meta tags
 * Dependencies: None
 */

// Imports
import React from 'react';
import PropTypes from 'prop-types';

const SEOHead = ({ title, description = 'CFH Auction Platform - Manage your auctions, disputes, and compliance.', keywords = 'auctions, disputes, compliance, CFH, platform' }) => {
  // Update document title
  React.useEffect(() => {
    document.title = title || 'CFH Auction Platform';
  }, [title]);

  return (
    <>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      {/* Open Graph Metadata */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {/* Twitter Card Metadata */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
};

// Prop Type Validation
SEOHead.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  keywords: PropTypes.string,
};

export default SEOHead;