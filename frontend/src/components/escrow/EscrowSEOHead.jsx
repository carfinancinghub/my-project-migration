// File: EscrowSEOHead.jsx
// Path: frontend/src/components/escrow/EscrowSEOHead.jsx
// Author: Cod2 (05072100)
// Description: Dynamic SEO meta tag and title injector for escrow pages

import React from 'react';
import { Helmet } from 'react-helmet-async';

const EscrowSEOHead = ({ title = 'Escrow Management', description = 'Securely manage escrow transactions, conditions, and releases.' }) => (
  <Helmet>
    <title>{title} | Rivers Auction</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta name="robots" content="index,follow" />
  </Helmet>
);

export default EscrowSEOHead;
