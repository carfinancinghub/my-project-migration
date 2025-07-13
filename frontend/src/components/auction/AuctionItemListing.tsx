/*
File: AuctionItemListing.tsx
Path: C:\CFH\frontend\src\components\auction\AuctionItemListing.tsx
Created: 2025-07-03 13:45 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Component to display a single auction item with tiered features.
Artifact ID: z9a0b1c2-d3e4-f5g6-h7i8-j9k0l1m2n3o4 // New unique ID
Version ID: a0b1c2d3-e4f5-g6h7-i8j9-k0l1m2n3o4p5 // New unique ID
*/

import React from 'react';
import logger from '@/utils/logger'; // Centralized logging utility
// import { auctionApi } from '@/services/auctionApi'; // For potential future direct data fetching within component
// import { ARViewer } from '@/components/ar/ARViewer'; // For Wow++ AR features
// import { BlockchainRecordDisplay } from '@/components/blockchain/BlockchainRecordDisplay'; // For Wow++ blockchain details

// Define comprehensive interface for an Auction Item
interface AuctionItem {
    id: string;
    vin: string;
    title: string;
    description: string;
    startingBid: number;
    currentBid: number;
    photos: string[];
    endTime: string;
    status: 'Live' | 'Ended' | 'Pending';
    // Standard Tier additions
    bidHistory?: { bidderId: string; bidAmount: number; timestamp: string; }[]; // Last 5 bids
    // Premium Tier additions
    reservePrice?: number;
    buyItNowPrice?: number;
    // Wow++ Tier additions
    aiBidSuggestions?: { recommendedBid?: number; confidence?: number; optimalTime?: string; }[];
    // Placeholder for other Wow++ features like AR/VR or blockchain links
    arModelUrl?: string; // For AR/VR display
    blockchainRecordId?: string; // For immutable bid record transparency
}

// Define props for the AuctionItemListing component
interface AuctionItemListingProps {
    auction: AuctionItem;
    userTier: 'free' | 'standard' | 'premium' | 'wowplus';
}

const AuctionItemListing: React.FC<AuctionItemListingProps> = ({ auction, userTier }) => {
    // CQS: Ensure <1s render (frontend perception)
    const startTime = performance.now();

    // Handle missing auction data
    if (!auction) {
        logger.error('AuctionItemListing: No auction data provided.');
        return <div role="alert" className="text-center p-4 text-red-600">Error: Auction data is missing.</div>;
    }

    // CQS: Audit logging on render
    logger.info(`Rendering AuctionItemListing for ${auction.vin}, Tier: ${userTier}`);

    const renderTimeMs = performance.now() - startTime;
    if (renderTimeMs > 1000) { // CQS: <1s render
        logger.warn(`AuctionItemListing for ${auction.vin} render time exceeded 1s: ${renderTimeMs.toFixed(2)}ms`);
    }

    // CQS: Accessibility (WCAG 2.1 AA with ARIA labels)
    return (
        <div className="auction-item-listing p-4 bg-white rounded-lg shadow-md" aria-label={`Auction listing for ${auction.title}`}>
            <h2 className="text-xl font-bold mb-2" aria-level={2}>{auction.title}</h2>
            <p className="text-sm text-gray-600 mb-4" aria-label={`Vehicle identification number is ${auction.vin}`}>VIN: {auction.vin}</p>

            {/* Basic Details (Free Tier and above) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="auction-details">
                    <p className="mb-2" aria-label={`Description: ${auction.description}`}>{auction.description}</p>
                    <p className="font-semibold" aria-label={`Starting bid is ${auction.startingBid} dollars`}>Starting Bid: ${auction.startingBid.toLocaleString()}</p>
                    <p className="font-semibold" aria-label={`Current bid is ${auction.currentBid} dollars`}>Current Bid: ${auction.currentBid.toLocaleString()}</p>
                    <p className="text-gray-700" aria-label={`Auction ends at ${new Date(auction.endTime).toLocaleString()}`}>Ends: {new Date(auction.endTime).toLocaleString()}</p>
                    <p className="text-gray-700" aria-label={`Auction status is ${auction.status}`}>Status: {auction.status}</p>
                </div>
                <div className="auction-photos">
                    {auction.photos && auction.photos.length > 0 ? (
                        <img src={auction.photos[0]} alt={`Primary photo of ${auction.title}`} className="w-full h-auto rounded-md shadow-sm" aria-label={`Main photo of ${auction.title}`} />
                    ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">No Photos Available</div>
                    )}
                    {/* Display other photos */}
                    {auction.photos && auction.photos.length > 1 && (
                        <div className="flex space-x-2 mt-2 overflow-x-auto" role="list" aria-label="Other auction photos">
                            {auction.photos.slice(1, userTier === 'free' ? 5 : auction.photos.length).map((photo, index) => (
                                <img key={index} src={photo} alt={`Additional photo ${index + 2} of ${auction.title}`} className="w-20 h-20 object-cover rounded-md" role="listitem" />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Standard Tier: Bid History */}
            {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && auction.bidHistory && auction.bidHistory.length > 0 && (
                <section className="mt-6">
                    <h3 className="text-lg font-semibold mb-2" aria-level={3}>Recent Bid History</h3>
                    <ul className="list-disc pl-5" aria-label="List of recent bids">
                        {auction.bidHistory.slice(0, 5).map((bid, index) => ( // Show last 5 bids
                            <li key={index} className="text-sm text-gray-700" role="listitem" aria-label={`Bid of ${bid.bidAmount} by bidder ${bid.bidderId} at ${new Date(bid.timestamp).toLocaleString()}`}>
                                **{bid.bidderId}** bid **${bid.bidAmount.toLocaleString()}** at {new Date(bid.timestamp).toLocaleTimeString()}
                            </li>
                        ))}
                    </ul>
                    {auction.bidHistory.length > 5 && (
                        <p className="text-sm text-gray-500 mt-2">...and {auction.bidHistory.length - 5} more bids. <a href="#" className="text-blue-600 hover:underline" aria-label="View full bid history">View Full History</a></p>
                    )}
                </section>
            )}

            {/* Premium Tier: Reserve Price and Buy It Now Price */}
            {(userTier === 'premium' || userTier === 'wowplus') && (auction.reservePrice !== undefined || auction.buyItNowPrice !== undefined) && (
                <section className="mt-6">
                    <h3 className="text-lg font-semibold mb-2" aria-level={3}>Premium Pricing Details</h3>
                    {auction.reservePrice !== undefined && (
                        <p className="text-green-700 font-medium" aria-label={`Reserve price is ${auction.reservePrice} dollars`}>Reserve Price: ${auction.reservePrice.toLocaleString()} (Hidden until met)</p>
                    )}
                    {auction.buyItNowPrice !== undefined && (
                        <p className="text-purple-700 font-medium" aria-label={`Buy It Now price is ${auction.buyItNowPrice} dollars`}>Buy It Now: ${auction.buyItNowPrice.toLocaleString()}</p>
                    )}
                </section>
            )}

            {/* Wow++ Tier: AI Bid Suggestions */}
            {userTier === 'wowplus' && auction.aiBidSuggestions && auction.aiBidSuggestions.length > 0 && (
                <section className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200" aria-label="AI-powered bid suggestions">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2" aria-level={3}>AI Bid Suggestions</h3>
                    {auction.aiBidSuggestions.map((suggestion, index) => (
                        <p key={index} className="text-sm text-blue-700" role="status" aria-label={`AI suggests a recommended bid of ${suggestion.recommendedBid} dollars with ${suggestion.confidence} percent confidence, optimal time to bid is ${suggestion.optimalTime}`}>
                            Recommended Bid: <span className="font-bold">${suggestion.recommendedBid?.toLocaleString()}</span> (Confidence: {(suggestion.confidence || 0) * 100}%)
                            {suggestion.optimalTime && ` - Optimal Time: ${suggestion.optimalTime}`}
                        </p>
                    ))}
                    {/* TODO: Placeholder for AR/VR integration button */}
                    {auction.arModelUrl && (
                        <button className="btn btn-sm mt-3 bg-indigo-600 text-white hover:bg-indigo-700" aria-label="View in Augmented Reality">
                            View in AR/VR
                        </button>
                        // <ARViewer modelUrl={auction.arModelUrl} />
                    )}
                    {/* TODO: Placeholder for Blockchain record display */}
                    {auction.blockchainRecordId && (
                        <button className="btn btn-sm mt-3 ml-2 bg-green-600 text-white hover:bg-green-700" aria-label="View blockchain record">
                            View Blockchain Record
                        </button>
                        // <BlockchainRecordDisplay recordId={auction.blockchainRecordId} />
                    )}
                </section>
            )}
        </div>
    );
};

export default AuctionItemListing;