// File: AuctionHistoryTracker.jsx
// Path: frontend/src/components/auction/core/AuctionHistoryTracker.jsx
// Purpose: Show auction bid history, premium insights like heatmaps, blockchain logs, seller badges
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import PropTypes from 'prop-types';
import logger from '@/utils/logger';
import HeatmapChart from '@/components/common/HeatmapChart';
import BlockchainSnapshotViewer from '@/components/common/BlockchainSnapshotViewer';
import SellerBadgePanel from '@/components/auction/SellerBadgePanel';

const AuctionHistoryTracker = ({ bidHistory, heatmapData, snapshot, sellerStats, isPremium }) => {
  try {
    return (
      <div className="p-4 border bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Auction History Tracker</h2>

        <section className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Basic Bid History</h3>
          <ul className="text-sm space-y-1">
            {bidHistory.map((bid, idx) => (
              <li key={idx} className="text-gray-700">
                <span className="font-mono">{bid.time}</span>: ${bid.amount}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-4">
          <HeatmapChart data={heatmapData} isPremium={isPremium} />
        </section>

        <section className="mb-4">
          <BlockchainSnapshotViewer snapshot={snapshot} isPremium={isPremium} />
        </section>

        <section className="mb-4">
          <SellerBadgePanel sellerStats={sellerStats} isPremium={isPremium} />
        </section>
      </div>
    );
  } catch (error) {
    logger.error('AuctionHistoryTracker render error:', error);
    return <div className="text-red-600">Error displaying auction history</div>;
  }
};

AuctionHistoryTracker.propTypes = {
  bidHistory: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  heatmapData: PropTypes.array.isRequired,
  snapshot: PropTypes.object.isRequired,
  sellerStats: PropTypes.object.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default AuctionHistoryTracker;

/*
Functions Summary:
- AuctionHistoryTracker
  - Purpose: Show standard and premium bid history data.
  - Inputs:
    - bidHistory (array): All bid events
    - heatmapData (array): For premium heatmap
    - snapshot (object): Blockchain snapshot
    - sellerStats (object): Gamified seller stats
    - isPremium (bool): Feature access gate
  - Outputs:
    - JSX-rendered auction analytics
  - Dependencies:
    - React, PropTypes, logger, HeatmapChart, BlockchainSnapshotViewer, SellerBadgePanel
*/
