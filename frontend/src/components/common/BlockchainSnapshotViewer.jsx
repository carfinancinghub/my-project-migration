// File: BlockchainSnapshotViewer.jsx
// Path: frontend/src/components/common/BlockchainSnapshotViewer.jsx
// Purpose: Display immutable blockchain-based bid snapshot data for premium users
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import PropTypes from 'prop-types';
import logger from '@/utils/logger';

/**
 * BlockchainSnapshotViewer Component
 * @param {Object} snapshot - Contains bid records keyed by timestamp.
 * @param {Boolean} isPremium - Whether the user has access to premium features.
 */
const BlockchainSnapshotViewer = ({ snapshot, isPremium }) => {
  try {
    if (!isPremium) {
      return <div className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock blockchain bid history.</div>;
    }

    if (!snapshot || typeof snapshot !== 'object') {
      throw new Error('Invalid snapshot format');
    }

    const entries = Object.entries(snapshot);

    return (
      <div className="p-4 border rounded bg-white shadow">
        <h3 className="text-lg font-semibold mb-2">Blockchain Bid Snapshot</h3>
        <ul className="text-sm space-y-1">
          {entries.map(([timestamp, bid], idx) => (
            <li key={idx} className="text-gray-700">
              <span className="font-mono text-indigo-700">{timestamp}</span>: {bid} USD
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    logger.error('BlockchainSnapshotViewer render error:', error);
    return <div className="text-red-600 text-sm">Error rendering blockchain snapshot</div>;
  }
};

BlockchainSnapshotViewer.propTypes = {
  snapshot: PropTypes.object.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default BlockchainSnapshotViewer;

/*
Functions Summary:
- BlockchainSnapshotViewer
  - Purpose: Render immutable bid records from blockchain snapshot.
  - Inputs:
    - snapshot (object): Key-value pairs of timestamp and bid amount.
    - isPremium (boolean): Feature access flag.
  - Output:
    - JSX list or locked message.
  - Dependencies:
    - React, PropTypes, @utils/logger
*/