/**
 * File: AuctionSEOHead.jsx
 * Path: frontend/src/components/auction/AuctionSEOHead.jsx
 * Purpose: Dynamic meta tags for SEO on auction pages
 * Author: Cod2 (05082217)
 * Date: May 08, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useEffect } from 'react';
import logger from '@utils/logger';

// --- Component Definition ---
/**
 * AuctionSEOHead Component
 * Purpose: Injects SEO and Open Graph tags dynamically based on auction content
 * Props:
 *   - auction: Object containing auction metadata (e.g., vehicle, category)
 * Returns: Null (modifies document.head directly)
 */
const AuctionSEOHead = ({ auction }) => {
  /**
   * generateSEOKeywords
   * Purpose: Creates SEO keyword string based on auction category
   */
  const generateSEOKeywords = (auctionCategory) => {
    return `auction, ${auctionCategory}, vehicle bidding, equity financing, Rivers Auction`;
  };

  /**
   * updateDynamicTitle
   * Purpose: Updates the page title based on auction details
   */
  const updateDynamicTitle = (auction) => {
    try {
      document.title = `${auction.vehicle} Auction | Rivers Auction Platform`;
    } catch (error) {
      logError(error);
    }
  };

  /**
   * logError
   * Purpose: Logs runtime errors related to SEO injection
   */
  const logError = (error) => {
    logger.error(`AuctionSEOHead Error: ${error.message}`);
  };

  // --- Lifecycle Hook with modular meta tag injection ---
  useEffect(() => {
    if (!auction) return;

    const tags = [];

    const createAndAppendMeta = (nameOrProp, content, isProperty = false) => {
      try {
        const tag = document.createElement('meta');
        if (isProperty) tag.setAttribute('property', nameOrProp);
        else tag.name = nameOrProp;
        tag.content = content;
        document.head.appendChild(tag);
        tags.push(tag);
      } catch (error) {
        logError(error);
      }
    };

    createAndAppendMeta('keywords', generateSEOKeywords(auction.category));
    createAndAppendMeta(
      'description',
      `Bid on ${auction.vehicle} via equity financing. No FICA checks required unless opted in.`
    );
    createAndAppendMeta('og:title', `${auction.vehicle} Equity Auction`, true);
    createAndAppendMeta(
      'og:description',
      `Join the Rivers Auction for ${auction.vehicle} – 100% equity-financed bidding.`,
      true
    );
    createAndAppendMeta('og:type', 'website', true);

    updateDynamicTitle(auction);

    return () => {
      tags.forEach((tag) => {
        try {
          document.head.removeChild(tag);
        } catch (error) {
          logError(error);
        }
      });
    };
  }, [auction]);

  return null;
};

export default AuctionSEOHead;

