// File: auctionExportUtils.js
// Path: frontend/src/utils/auction/auctionExportUtils.js
// Author: Cod5 (05082141, May 08, 2025, 21:41 PDT)
// Purpose: Utility for exporting auction-related data (e.g., auction records, summaries) as CSV or PDF, supporting analytics features for free and Enterprise users

// TODO: Update to use aliases (e.g., @utils/axios, @utils/react-toastify) if added to platform configuration
import axios from 'axios';
import { logError } from '@utils/logger';
import { toast } from 'react-toastify';

// === Auction Export Utilities ===
// Exports basic auction data to CSV for free users
export const exportAuctionDataAsCSV = async (auctions) => {
  try {
    if (!Array.isArray(auctions)) {
      throw new Error('Invalid auction data: must be an array');
    }

    const csvContent = [
      'ID,Title,Current Bid,Time Remaining',
      ...auctions.map(auction =>
        `${auction.id},${auction.title},${auction.currentBid.toFixed(2)},${auction.timeRemaining}`
      ),
    ].join('\n');

    const response = await axios.post('/api/export/csv', { content: csvContent });
    toast.success('Auction data exported as CSV!');
    return response.data.url; // Assumes API returns a downloadable URL
  } catch (err) {
    logError(err);
    toast.error('Failed to export auction data as CSV.');
    throw new Error('Failed to export auction data.');
  }
};

// Intended for Enterprise users; gate with PremiumFeature (feature="auctionAnalytics") at the component level
// Exports detailed auction summary to PDF for Enterprise users
export const exportAuctionSummaryAsPDF = async (auctions, summaryData) => {
  try {
    if (!Array.isArray(auctions) || !summaryData || typeof summaryData !== 'object') {
      throw new Error('Invalid auction or summary data');
    }

    const payload = {
      auctions,
      summary: {
        totalAuctions: summaryData.totalAuctions || auctions.length,
        totalBidValue: summaryData.totalBidValue || auctions.reduce((sum, a) => sum + a.currentBid, 0),
        trendingVehicles: summaryData.trendingVehicles || [],
      },
    };

    const response = await axios.post('/api/export/pdf', payload, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    toast.success('Auction summary exported as PDF!');
    return url; // Returns a blob URL for download
  } catch (err) {
    logError(err);
    toast.error('Failed to export auction summary as PDF.');
    throw new Error('Failed to export auction summary.');
  }
};

**Functions Summary**:
- **exportAuctionDataAsCSV(auctions)**
  - **Purpose**: Exports basic auction data to CSV for free users.
  - **Inputs**: auctions (Array) - Array of auction objects with id, title, currentBid, timeRemaining.
  - **Outputs**: String - URL for the downloadable CSV file.
  - **Dependencies**: axios, @utils/logger (logError), react-toastify (toast)
- **exportAuctionSummaryAsPDF(auctions, summaryData)**
  - **Purpose**: Exports a detailed auction summary to PDF for Enterprise users.
  - **Inputs**: auctions (Array) - Array of auction objects; summaryData (Object) - Summary stats like totalAuctions, totalBidValue, trendingVehicles.
  - **Outputs**: String - URL for the downloadable PDF file.
  - **Dependencies**: axios, @utils/logger (logError), react-toastify (toast)