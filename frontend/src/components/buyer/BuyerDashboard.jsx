/**
 * File: BuyerDashboard.jsx
 * Path: frontend/src/components/buyer/BuyerDashboard.jsx
 * Purpose: Centralized dashboard for Buyer role (Updated with link to BuyerAnalyticsDashboard)
 * Author: Rivers Auction Dev Team
 * Date: 2025-05-25
 * Updated: Added SEOHead for SEO optimization, updated imports to use @ alias
 * Cod2 Crown Certified: Yes
 * @aliases: @utils/logger, @services/api/auction, @services/api/mechanic, @services/api/storage, @services/api/insurance, @services/api/financing
 */

// Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getAuctions, getAuctionDetails } from '@services/api/auction';
import { getInspectionReport } from '@services/api/mechanic';
import { getStorageAuctions, placeStorageBid } from '@services/api/storage';
import { getInsuranceOffers, purchaseInsurance } from '@services/api/insurance';
import { getInvestments, acceptInvestment } from '@services/api/financing';
import AuctionLiveBidTracker from '@components/auction/AuctionLiveBidTracker';
import Messaging from '@components/common/Messaging';
import NotificationPreferences from '@components/common/NotificationPreferences';
import SEOHead from '@components/common/SEOHead';

const BuyerDashboard = ({ userId }) => {
  // State Management
  const [auctions, setAuctions] = useState([]);
  const [storageAuctions, setStorageAuctions] = useState([]);
  const [insuranceOffers, setInsuranceOffers] = useState([]);
  const [financingOffers, setFinancingOffers] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [inspectionReport, setInspectionReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ make: '', model: '', year: '', priceRange: '' });
  const [modal, setModal] = useState({ type: null, data: null }); // For modals: storage, insurance, financing

  // Fetch Data on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const auctionsData = await getAuctions();
        setAuctions(auctionsData);

        const storageData = await getStorageAuctions();
        setStorageAuctions(storageData);

        const insuranceData = await getInsuranceOffers();
        setInsuranceOffers(insuranceData);

        const financingData = await getInvestments(userId);
        setFinancingOffers(financingData);

        logger.info(`[BuyerDashboard] Fetched data for userId: ${userId}`);
      } catch (err) {
        logger.error(`[BuyerDashboard] Failed to fetch data for userId ${userId}: ${err.message}`, err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Handle Filter Changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle Auction Selection
  const handleSelectAuction = async (auctionId) => {
    setIsLoading(true);
    try {
      const auctionDetails = await getAuctionDetails(auctionId);
      const report = await getInspectionReport(auctionId);
      setSelectedAuction(auctionDetails);
      setInspectionReport(report);
      logger.info(`[BuyerDashboard] Selected auction ${auctionId} for userId: ${userId}`);
    } catch (err) {
      logger.error(`[BuyerDashboard] Failed to select auction ${auctionId}: ${err.message}`, err);
      setError('Failed to load auction details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Storage Bid Placement
  const handleStorageBid = async (auctionId, bidAmount) => {
    setIsLoading(true);
    try {
      await placeStorageBid(userId, auctionId, bidAmount);
      const updatedStorageAuctions = await getStorageAuctions();
      setStorageAuctions(updatedStorageAuctions);
      setModal({ type: null, data: null });
      logger.info(`[BuyerDashboard] Placed storage bid for auctionId: ${auctionId} by userId: ${userId}`);
    } catch (err) {
      logger.error(`[BuyerDashboard] Failed to place storage bid for auctionId ${auctionId}: ${err.message}`, err);
      setError('Failed to place storage bid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Insurance Purchase
  const handlePurchaseInsurance = async (offerId) => {
    setIsLoading(true);
    try {
      await purchaseInsurance(userId, offerId);
      const updatedInsuranceOffers = await getInsuranceOffers();
      setInsuranceOffers(updatedInsuranceOffers);
      setModal({ type: null, data: null });
      logger.info(`[BuyerDashboard] Purchased insurance for offerId: ${offerId} by userId: ${userId}`);
    } catch (err) {
      logger.error(`[BuyerDashboard] Failed to purchase insurance for offerId ${offerId}: ${err.message}`, err);
      setError('Failed to purchase insurance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Financing Acceptance
  const handleAcceptFinancing = async (investmentId) => {
    setIsLoading(true);
    try {
      await acceptInvestment(userId, investmentId);
      const updatedFinancingOffers = await getInvestments(userId);
      setFinancingOffers(updatedFinancingOffers);
      setModal({ type: null, data: null });
      logger.info(`[BuyerDashboard] Accepted financing for investmentId: ${investmentId} by userId: ${userId}`);
    } catch (err) {
      logger.error(`[BuyerDashboard] Failed to accept financing for investmentId ${investmentId}: ${err.message}`, err);
      setError('Failed to accept financing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Auctions Based on User Input
  const filteredAuctions = auctions.filter(auction => (
    (!filters.make || auction.vehicleDetails.make.toLowerCase().includes(filters.make.toLowerCase())) &&
    (!filters.model || auction.vehicleDetails.model.toLowerCase().includes(filters.model.toLowerCase())) &&
    (!filters.year || auction.vehicleDetails.year === parseInt(filters.year)) &&
    (!filters.priceRange || auction.currentBid <= parseInt(filters.priceRange))
  ));

  // UI Rendering
  if (isLoading) return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <SEOHead title="Buyer Dashboard - CFH Auction Platform" />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Buyer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notification Preferences */}
        <div className="col-span-1">
          <NotificationPreferences userId={userId} />
        </div>
        {/* Messaging */}
        <div className="col-span-1">
          <Messaging userId={userId} context={{ auctionId: selectedAuction?.id || '' }} />
        </div>
        {/* Main Dashboard Content */}
        <div className="col-span-1 md:col-span-2">
          {/* Navigation */}
          <div className="bg-white rounded-lg p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Navigation</h2>
            <div className="flex space-x-4">
              <a href="/buyer/analytics" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
                View Analytics Dashboard
              </a>
            </div>
          </div>
          {/* Filters */}
          <div className="bg-white rounded-lg p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Auctions</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Make</label>
                <input
                  type="text"
                  value={filters.make}
                  onChange={(e) => handleFilterChange('make', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Toyota"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  value={filters.model}
                  onChange={(e) => handleFilterChange('model', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Camry"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Year</label>
                <input
                  type="number"
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2020"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Max Price ($)</label>
                <input
                  type="number"
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 50000"
                />
              </div>
            </div>
          </div>
          {/* Auction Listings */}
          <div className="bg-white rounded-lg p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Auctions</h2>
            <div className="grid grid-cols-1 gap-4">
              {filteredAuctions.map(auction => (
                <div key={auction.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{auction.vehicleDetails.make} {auction.vehicleDetails.model} ({auction.vehicleDetails.year})</h3>
                    <p className="text-gray-600">Current Bid: ${auction.currentBid}</p>
                    <p className="text-gray-600">Time Remaining: {auction.timeRemaining}</p>
                  </div>
                  <button
                    onClick={() => handleSelectAuction(auction.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Selected Auction Details */}
          {selectedAuction && (
            <div className="bg-white rounded-lg p-4 shadow-md mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Auction Details</h2>
              <AuctionLiveBidTracker auctionId={selectedAuction.id} />
              {inspectionReport && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700">Mechanic Inspection Report</h3>
                  <p className="text-gray-600">Issues: {inspectionReport.issues.join(', ') || 'None'}</p>
                  <p className="text-gray-600">Timestamp: {new Date(inspectionReport.timestamp).toLocaleString()}</p>
                </div>
              )}
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => alert('Delivery Modal: Schedule delivery with Hauler')}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Schedule Delivery
                </button>
                <button
                  onClick={() => alert('Inspection Modal: Request Mechanic inspection')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Request Inspection
                </button>
                <button
                  onClick={() => setModal({ type: 'financing', data: financingOffers })}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  View Financing Options
                </button>
              </div>
            </div>
          )}
          {/* Storage Auctions */}
          <div className="bg-white rounded-lg p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Storage Options</h2>
            <div className="grid grid-cols-1 gap-4">
              {storageAuctions.map(storage => (
                <div key={storage.auctionId} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600">Location: {storage.location}</p>
                  <p className="text-gray-600">Duration: {storage.duration}</p>
                  <p className="text-gray-600">Price per Day: ${storage.pricePerDay}</p>
                  <p className="text-gray-600">Available Slots: {storage.availableSlots}</p>
                  <button
                    onClick={() => setModal({ type: 'storage', data: storage })}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Bid on Storage
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Insurance Offers */}
          <div className="bg-white rounded-lg p-4 shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Insurance Offers</h2>
            <div className="grid grid-cols-1 gap-4">
              {insuranceOffers.map(offer => (
                <div key={offer.offerId} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600">Coverage Type: {offer.coverageType}</p>
                  <p className="text-gray-600">Premium: ${offer.premium}</p>
                  <p className="text-gray-600">Duration: {offer.duration}</p>
                  <button
                    onClick={() => setModal({ type: 'insurance', data: offer })}
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Purchase Insurance
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Financing Offers */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Financing Options</h2>
            <div className="grid grid-cols-1 gap-4">
              {financingOffers.map(offer => (
                <div key={offer.investmentId} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600">Amount: ${offer.amount}</p>
                  <p className="text-gray-600">Status: {offer.status}</p>
                  {offer.status === 'offered' && (
                    <button
                      onClick={() => setModal({ type: 'financing_accept', data: offer })}
                      className="mt-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Accept Financing
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      {modal.type && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            {modal.type === 'storage' && (
              <>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Bid on Storage</h3>
                <p className="text-gray-600">Location: {modal.data.location}</p>
                <p className="text-gray-600">Duration: {modal.data.duration}</p>
                <p className="text-gray-600">Price per Day: ${modal.data.pricePerDay}</p>
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Your Bid ($)</label>
                  <input
                    type="number"
                    value={modal.data.bidAmount || ''}
                    onChange={(e) => setModal(prev => ({ ...prev, data: { ...prev.data, bidAmount: e.target.value } }))}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your bid"
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => setModal({ type: null, data: null })}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStorageBid(modal.data.auctionId, modal.data.bidAmount)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Place Bid
                  </button>
                </div>
              </>
            )}
            {modal.type === 'insurance' && (
              <>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Purchase Insurance</h3>
                <p className="text-gray-600">Coverage Type: {modal.data.coverageType}</p>
                <p className="text-gray-600">Premium: ${modal.data.premium}</p>
                <p className="text-gray-600">Duration: {modal.data.duration}</p>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => setModal({ type: null, data: null })}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePurchaseInsurance(modal.data.offerId)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Confirm Purchase
                  </button>
                </div>
              </>
            )}
            {modal.type === 'financing_accept' && (
              <>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Accept Financing</h3>
                <p className="text-gray-600">Amount: ${modal.data.amount}</p>
                <p className="text-gray-600">Status: {modal.data.status}</p>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => setModal({ type: null, data: null })}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAcceptFinancing(modal.data.investmentId)}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Accept Financing
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Prop Type Validation
BuyerDashboard.propTypes = {
  userId: PropTypes.string.isRequired
};

export default BuyerDashboard;