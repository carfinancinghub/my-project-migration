// File: BuyerAuctionHistory.jsx
// Path: C:\CFH\frontend\src\components\buyer\BuyerAuctionHistory.jsx
// Purpose: Display buyer’s auction history with SEO metadata
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/auction

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getAuctionHistory } from '@services/api/auction';

const BuyerAuctionHistory = ({ userId }) => {
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAuctionHistory(userId);
        setAuctions(data);
        logger.info(`[BuyerAuctionHistory] Fetched auction history for userId: ${userId}`);
      } catch (err) {
        logger.error(`[BuyerAuctionHistory] Failed to fetch auction history for userId ${userId}: ${err.message}`, err);
        setError('Failed to load auction history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  // SEO Metadata (SG Man requirement)
  const seoMetadata = {
    title: "Your Auction History - Rivers Auction Platform",
    description: "View your past vehicle auctions and bidding history on the Rivers Auction Platform.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": auctions.map((auction, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Auction",
          "name": auction.title,
          "description": `Auction on ${auction.date} with final bid ${auction.finalBid}`,
        }
      }))
    }
  };

  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading auction history...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;
  if (!auctions.length) return <div className="p-4 text-center text-gray-500">No auction history available.</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Your Auction History</h2>
      {/* SEO Metadata */}
      <Helmet>
        <title>{seoMetadata.title}</title>
        <meta name="description" content={seoMetadata.description} />
        <script type="application/ld+json">{JSON.stringify(seoMetadata.jsonLd)}</script>
      </Helmet>
      <ul className="space-y-4">
        {auctions.map((auction) => (
          <li key={auction.id} className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-700">{auction.title}</h3>
            <p className="text-sm text-gray-600">Date: {auction.date}</p>
            <p className="text-sm text-gray-600">Final Bid: ${auction.finalBid}</p>
            <p className="text-sm text-gray-600">Status: {auction.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

BuyerAuctionHistory.propTypes = { userId: PropTypes.string.isRequired };
export default BuyerAuctionHistory;