// File: BidHeatmapEngine.js
// Path: @services/auction/BidHeatmapEngine.js
// Purpose: Generate real-time bid heatmap data based on auction activity
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

const logger = require('@/utils/logger');

/**
 * Generates bid frequency heatmap data.
 * @param {String} auctionId - The unique ID of the auction.
 * @param {Object} timeRange - The time window for which to compute bid frequency.
 * @param {Date} timeRange.start - Start timestamp.
 * @param {Date} timeRange.end - End timestamp.
 * @returns {Array<Object>} heatmapData - Array of time buckets with bid counts.
 */
async function generateBidHeatmapData(auctionId, timeRange) {
  try {
    if (!auctionId || !timeRange?.start || !timeRange?.end) {
      throw new Error('Invalid parameters: auctionId and time range are required');
    }

    // Mocked bid events (in real system, fetch from DB or analytics engine)
    const mockBidEvents = [
      { timestamp: new Date('2025-05-12T12:00:00Z') },
      { timestamp: new Date('2025-05-12T12:01:00Z') },
      { timestamp: new Date('2025-05-12T12:02:30Z') },
      { timestamp: new Date('2025-05-12T12:10:00Z') },
      { timestamp: new Date('2025-05-12T12:12:00Z') },
    ];

    const bucketSizeInMinutes = 5;
    const heatmapData = [];
    const start = new Date(timeRange.start).getTime();
    const end = new Date(timeRange.end).getTime();

    for (let t = start; t < end; t += bucketSizeInMinutes * 60 * 1000) {
      const bucketStart = new Date(t);
      const bucketEnd = new Date(t + bucketSizeInMinutes * 60 * 1000);
      const count = mockBidEvents.filter(event => {
        const time = new Date(event.timestamp).getTime();
        return time >= bucketStart.getTime() && time < bucketEnd.getTime();
      }).length;

      heatmapData.push({
        timeWindow: `${bucketStart.toISOString()} - ${bucketEnd.toISOString()}`,
        bidCount: count,
      });
    }

    return heatmapData;
  } catch (error) {
    logger.error('generateBidHeatmapData failed:', error);
    return [];
  }
}

module.exports = { generateBidHeatmapData };

/*
Functions Summary:
- generateBidHeatmapData
  - Purpose: Generate a time-bucketed heatmap of bid activity for a given auction.
  - Inputs:
    - auctionId (string): Unique ID of the auction.
    - timeRange (object): Includes 'start' and 'end' Date fields.
  - Outputs:
    - Array of objects with 'timeWindow' and 'bidCount'.
  - Dependencies:
    - logger (@utils/logger)
*/

..................
// File: AIBidStarter.js
// Path: backend/services/auction/AIBidStarter.js
// Purpose: Suggest starting bid for auction listings based on vehicle details and market data
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

const logger = require('@/utils/logger');

/**
 * Suggests a starting bid using vehicle data and market insights.
 * @param {Object} vehicle - Vehicle details (make, model, year, mileage).
 * @param {Object} marketData - Recent bids, demand index, seasonal multipliers.
 * @returns {Number|null} suggestedBid - Computed bid suggestion or null on failure.
 */
function suggestStartingBid(vehicle, marketData) {
  try {
    const { make, model, year, mileage } = vehicle;
    const { recentBids, seasonalFactor, demandScore } = marketData;

    if (!make || !model || !year || !mileage || !Array.isArray(recentBids)) {
      throw new Error('Invalid vehicle or market data');
    }

    const avgRecentBid = recentBids.length
      ? recentBids.reduce((sum, bid) => sum + bid, 0) / recentBids.length
      : 5000;

    const basePrice = 10000 - (mileage * 0.05);
    const seasonalAdj = basePrice * (seasonalFactor || 1);
    const demandAdj = seasonalAdj * (1 + (demandScore || 0));

    const finalSuggestedBid = Math.round((demandAdj + avgRecentBid) / 2);

    return finalSuggestedBid;
  } catch (error) {
    logger.error('suggestStartingBid failed:', error);
    return null;
  }
}

module.exports = { suggestStartingBid };

/*
Functions Summary:
- suggestStartingBid
  - Purpose: Compute an AI-style suggested starting bid.
  - Inputs:
    - vehicle: { make, model, year, mileage }
    - marketData: { recentBids[], seasonalFactor, demandScore }
  - Output:
    - Number (suggested bid) or null
  - Dependencies:
    - logger (@utils/logger)
*/

..............................

// File: AuctionTemplateEngine.js
// Path: backend/services/auction/AuctionTemplateEngine.js
// Purpose: Manage reusable listing templates for auction creation
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

const logger = require('@/utils/logger');
const templates = {}; // Simulated in-memory store

/**
 * Saves a new auction template.
 * @param {String} sellerId - Unique identifier for the seller.
 * @param {Object} template - Template data including description, images, tags.
 * @returns {String|null} templateId - Unique ID of saved template or null on error.
 */
function saveTemplate(sellerId, template) {
  try {
    if (!sellerId || !template || typeof template !== 'object') {
      throw new Error('Invalid input: sellerId and template object are required');
    }
    const templateId = `${sellerId}-${Date.now()}`;
    templates[templateId] = { ...template, sellerId };
    return templateId;
  } catch (error) {
    logger.error('saveTemplate failed:', error);
    return null;
  }
}

/**
 * Retrieves a saved template by ID.
 * @param {String} templateId - ID of the template to retrieve.
 * @returns {Object|null} template - Retrieved template object or null.
 */
function getTemplate(templateId) {
  try {
    if (!templateId || typeof templateId !== 'string') {
      throw new Error('Invalid templateId');
    }
    return templates[templateId] || null;
  } catch (error) {
    logger.error('getTemplate failed:', error);
    return null;
  }
}

module.exports = { saveTemplate, getTemplate };

/*
Functions Summary:
- saveTemplate
  - Purpose: Save a new auction listing template.
  - Inputs: sellerId (string), template (object)
  - Output: string (templateId) or null
  - Dependencies: logger (@utils/logger)

- getTemplate
  - Purpose: Retrieve a saved template by its ID.
  - Inputs: templateId (string)
  - Output: object (template) or null
  - Dependencies: logger (@utils/logger)
*/

................................
// File: HeatmapChart.jsx
// Path: frontend/src/components/common/HeatmapChart.jsx
// Purpose: Visualize bid frequency as a heatmap for premium auction users
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import PropTypes from 'prop-types';
import logger from '@/utils/logger';

/**
 * HeatmapChart component
 * @param {Array} data - Array of objects containing timeWindow and bidCount.
 * @param {Boolean} isPremium - Whether the user has access to premium features.
 */
const HeatmapChart = ({ data, isPremium }) => {
  try {
    if (!isPremium) {
      return <div className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock bid heatmaps.</div>;
    }

    if (!Array.isArray(data)) {
      throw new Error('Invalid heatmap data');
    }

    return (
      <div className="p-4 bg-white border rounded-md shadow">
        <h3 className="text-lg font-semibold mb-2">Bid Frequency Heatmap</h3>
        <ul className="space-y-1">
          {data.map((entry, idx) => (
            <li key={idx} className="text-sm text-gray-700">
              <span className="font-mono text-blue-800">{entry.timeWindow}</span>: {entry.bidCount} bids
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    logger.error('HeatmapChart render error:', error);
    return <div className="text-red-600 text-sm">Error rendering heatmap</div>;
  }
};

HeatmapChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      timeWindow: PropTypes.string.isRequired,
      bidCount: PropTypes.number.isRequired,
    })
  ).isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default HeatmapChart;

/*
Functions Summary:
- HeatmapChart
  - Purpose: Render a bid frequency heatmap for auctions.
  - Inputs:
    - data (array): Array of { timeWindow, bidCount } objects.
    - isPremium (boolean): Feature gating flag.
  - Output:
    - JSX heatmap or upgrade message.
  - Dependencies:
    - React, PropTypes, @utils/logger
*/
.................
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
......................
// File: SellerBadgePanel.jsx
// Path: frontend/src/components/auction/SellerBadgePanel.jsx
// Purpose: Show gamified seller badges and rank visuals gated for premium users
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import PropTypes from 'prop-types';
import logger from '@/utils/logger';

/**
 * SellerBadgePanel Component
 * @param {Object} sellerStats - Includes winRate, bidVelocity, engagementScore.
 * @param {Boolean} isPremium - Whether user has access to premium rank features.
 */
const SellerBadgePanel = ({ sellerStats, isPremium }) => {
  try {
    if (!isPremium) {
      return <div className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock seller badge analytics.</div>;
    }

    if (!sellerStats || typeof sellerStats !== 'object') {
      throw new Error('Invalid sellerStats input');
    }

    const { winRate, bidVelocity, engagementScore } = sellerStats;

    return (
      <div className="p-4 border rounded bg-white shadow">
        <h3 className="text-lg font-semibold mb-2">Seller Rank & Badge Panel</h3>
        <ul className="text-sm space-y-1">
          <li>🏆 Win Rate: <span className="font-medium">{winRate}%</span></li>
          <li>⚡ Bid Velocity: <span className="font-medium">{bidVelocity} bids/hour</span></li>
          <li>🔥 Engagement Score: <span className="font-medium">{engagementScore}/100</span></li>
        </ul>
      </div>
    );
  } catch (error) {
    logger.error('SellerBadgePanel render error:', error);
    return <div className="text-red-600 text-sm">Error rendering seller badge panel</div>;
  }
};

SellerBadgePanel.propTypes = {
  sellerStats: PropTypes.shape({
    winRate: PropTypes.number.isRequired,
    bidVelocity: PropTypes.number.isRequired,
    engagementScore: PropTypes.number.isRequired,
  }).isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default SellerBadgePanel;

/*
Functions Summary:
- SellerBadgePanel
  - Purpose: Display seller’s gamified metrics and performance badges.
  - Inputs:
    - sellerStats (object): Contains winRate, bidVelocity, engagementScore.
    - isPremium (boolean): Feature gating flag.
  - Output:
    - JSX-rendered rank panel or locked message.
  - Dependencies:
    - React, PropTypes, @utils/logger
*/
................
// File: AuctionListingForm.jsx
// Path: frontend/src/components/auction/core/AuctionListingForm.jsx
// Purpose: Enhanced auction listing form with premium AI bid suggestions, templates, and scheduling
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@/utils/logger';
import { suggestStartingBid } from '@services/auction/AIBidStarter';
import { saveTemplate, getTemplate } from '@services/auction/AuctionTemplateEngine';

const AuctionListingForm = ({ vehicle, isPremium }) => {
  const [startingBid, setStartingBid] = useState('');
  const [templateId, setTemplateId] = useState(null);
  const [scheduleTime, setScheduleTime] = useState('');

  useEffect(() => {
    const generateSuggestion = async () => {
      try {
        if (!isPremium) return;
        const suggestion = suggestStartingBid(vehicle, {
          recentBids: [5200, 5600, 5900],
          seasonalFactor: 1.05,
          demandScore: 0.12,
        });
        setStartingBid(suggestion);
      } catch (error) {
        logger.error('AI bid suggestion failed:', error);
      }
    };
    generateSuggestion();
  }, [vehicle, isPremium]);

  const handleSaveTemplate = async () => {
    try {
      const id = saveTemplate('seller123', {
        description: 'Fast car with upgrades',
        tags: ['turbo', 'low-mileage'],
        images: ['car1.jpg', 'car2.jpg'],
      });
      setTemplateId(id);
    } catch (error) {
      logger.error('Template save error:', error);
    }
  };

  return (
    <div className="p-4 border bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Auction Listing</h2>

      <div className="mb-3">
        <label className="block font-medium">Suggested Starting Bid:</label>
        <input
          type="number"
          value={startingBid}
          readOnly
          className="border rounded px-2 py-1 text-gray-700 w-full"
        />
        {!isPremium && <p className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock AI suggestions.</p>}
      </div>

      <div className="mb-3">
        <label className="block font-medium">Use Template:</label>
        <button
          onClick={handleSaveTemplate}
          disabled={!isPremium}
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-300"
        >
          Save as Template
        </button>
        {!isPremium && <p className="text-sm text-gray-500 italic">Premium feature — upgrade to use templates.</p>}
      </div>

      <div className="mb-3">
        <label className="block font-medium">Schedule Listing (UTC):</label>
        <input
          type="datetime-local"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
          disabled={!isPremium}
          className="border rounded px-2 py-1 text-gray-700 w-full"
        />
        {!isPremium && <p className="text-sm text-gray-500 italic">Premium feature — upgrade to enable scheduling bot.</p>}
      </div>

      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Submit Listing</button>
    </div>
  );
};

AuctionListingForm.propTypes = {
  vehicle: PropTypes.shape({
    make: PropTypes.string,
    model: PropTypes.string,
    year: PropTypes.number,
    mileage: PropTypes.number,
  }).isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default AuctionListingForm;

/*
Functions Summary:
- AuctionListingForm
  - Purpose: Provide a listing form with optional premium features (AI bid suggestion, template save, scheduling).
  - Inputs:
    - vehicle (object): Vehicle data
    - isPremium (bool): Premium access flag
  - Outputs:
    - JSX form UI for listing
  - Dependencies:
    - React, PropTypes, logger, @services/auction/AIBidStarter, @services/auction/AuctionTemplateEngine
*/
.......................
// File: AuctionListingForm.test.jsx
// Path: frontend/src/tests/auction/core/AuctionListingForm.test.jsx
// Purpose: Test suite for AuctionListingForm premium features (AI, template, scheduling)
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionListingForm from '@/components/auction/core/AuctionListingForm';

jest.mock('@services/auction/AIBidStarter', () => ({
  suggestStartingBid: jest.fn(() => 5500),
}));

jest.mock('@services/auction/AuctionTemplateEngine', () => ({
  saveTemplate: jest.fn(() => 'template-xyz'),
  getTemplate: jest.fn(() => ({ description: 'Mock', tags: [], images: [] })),
}));

describe('AuctionListingForm - Premium Feature Tests', () => {
  const mockVehicle = {
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    mileage: 10000,
  };

  it('renders AI suggestion for premium users', async () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={true} />);
    expect(await screen.findByDisplayValue('5500')).toBeInTheDocument();
  });

  it('shows locked message for AI suggestion for non-premium users', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={false} />);
    expect(screen.getByText(/upgrade to unlock AI suggestions/i)).toBeInTheDocument();
  });

  it('enables template save for premium users', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={true} />);
    const btn = screen.getByText('Save as Template');
    expect(btn).not.toBeDisabled();
  });

  it('disables template save for non-premium users', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={false} />);
    const btn = screen.getByText('Save as Template');
    expect(btn).toBeDisabled();
  });

  it('shows scheduling field and restricts it based on isPremium', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={false} />);
    const input = screen.getByLabelText(/Schedule Listing/i);
    expect(input).toBeDisabled();
    expect(screen.getByText(/upgrade to enable scheduling/i)).toBeInTheDocument();
  });
});

/*
Functions Summary:
- Tests AI bid suggestion rendering and gating
- Verifies template save button enabled/disabled by premium flag
- Checks schedule listing input accessibility based on premium status
- Dependencies: React, jest, @services/auction/AIBidStarter, AuctionTemplateEngine, @testing-library/react
*/
...............
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
.................
// File: AuctionHistoryTracker.test.jsx
// Path: frontend/src/tests/auction/core/AuctionHistoryTracker.test.jsx
// Purpose: Validate AuctionHistoryTracker with premium and non-premium scenarios
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionHistoryTracker from '@/components/auction/core/AuctionHistoryTracker';

jest.mock('@/components/common/HeatmapChart', () => ({ __esModule: true, default: ({ isPremium }) => <div>{isPremium ? 'HeatmapChart' : 'Upgrade Heatmap'}</div> }));
jest.mock('@/components/common/BlockchainSnapshotViewer', () => ({ __esModule: true, default: ({ isPremium }) => <div>{isPremium ? 'BlockchainSnapshotViewer' : 'Upgrade Blockchain'}</div> }));
jest.mock('@/components/auction/SellerBadgePanel', () => ({ __esModule: true, default: ({ isPremium }) => <div>{isPremium ? 'SellerBadgePanel' : 'Upgrade Badges'}</div> }));

describe('AuctionHistoryTracker', () => {
  const mockProps = {
    bidHistory: [
      { time: '2025-05-12T12:00:00Z', amount: 5400 },
      { time: '2025-05-12T12:05:00Z', amount: 5500 },
    ],
    heatmapData: [{ timeWindow: '12:00-12:05', bidCount: 2 }],
    snapshot: { '2025-05-12T12:00:00Z': 5400 },
    sellerStats: { winRate: 87, bidVelocity: 3.2, engagementScore: 91 },
    isPremium: true,
  };

  it('renders all premium components when isPremium is true', () => {
    render(<AuctionHistoryTracker {...mockProps} />);
    expect(screen.getByText('HeatmapChart')).toBeInTheDocument();
    expect(screen.getByText('BlockchainSnapshotViewer')).toBeInTheDocument();
    expect(screen.getByText('SellerBadgePanel')).toBeInTheDocument();
  });

  it('renders locked messages when isPremium is false', () => {
    render(<AuctionHistoryTracker {...mockProps} isPremium={false} />);
    expect(screen.getByText('Upgrade Heatmap')).toBeInTheDocument();
    expect(screen.getByText('Upgrade Blockchain')).toBeInTheDocument();
    expect(screen.getByText('Upgrade Badges')).toBeInTheDocument();
  });

  it('renders bid history list', () => {
    render(<AuctionHistoryTracker {...mockProps} />);
    expect(screen.getByText(/2025-05-12T12:00:00Z/i)).toBeInTheDocument();
    expect(screen.getByText(/5400/i)).toBeInTheDocument();
  });
});

/*
Functions Summary:
- Tests premium and non-premium rendering of auction insights (heatmap, blockchain, badges)
- Verifies bid history visibility and formatting
- Mocks all subcomponents for independent validation
*/

