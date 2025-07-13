// File: SEOHelper.js
// Path: C:\CFH\backend\services\seo\SEOHelper.js
// Purpose: Generate SEO metadata and structured data for auctions
// Author: Rivers Auction Dev Team
// Date: 2025-05-25
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger

const logger = require('@utils/logger');

const SEOHelper = {
  generateMetadata(auction) {
    try {
      const title = `${auction.title} - Rivers Auction Platform`;
      const description = `Bid on ${auction.title} starting at $${auction.currentBid}. Join the Rivers Auction Platform for immersive AR/VR bidding experiences!`;
      const metadata = {
        title,
        metaDescription: description,
        openGraph: {
          title,
          description,
          image: auction.images[0] || 'https://riversauction.com/default-image.jpg',
          url: `https://riversauction.com/auctions/${auction.id}`
        }
      };
      logger.info(`[SEOHelper] Generated metadata for auctionId: ${auction.id}`);
      return metadata;
    } catch (err) {
      logger.error(`[SEOHelper] Failed to generate metadata for auctionId ${auction.id}: ${err.message}`, err);
      throw err;
    }
  },

  generateStructuredData(auction) {
    try {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: auction.title,
        description: `Auction for ${auction.title} on Rivers Auction Platform.`,
        image: auction.images[0] || 'https://riversauction.com/default-image.jpg',
        offers: {
          '@type': 'Offer',
          price: auction.currentBid,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock'
        }
      };
      logger.info(`[SEOHelper] Generated structured data for auctionId: ${auction.id}`);
      return structuredData;
    } catch (err) {
      logger.error(`[SEOHelper] Failed to generate structured data for auctionId ${auction.id}: ${err.message}`, err);
      throw err;
    }
  }
};

module.exports = SEOHelper;