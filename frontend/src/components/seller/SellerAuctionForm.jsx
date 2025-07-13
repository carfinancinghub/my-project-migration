// File: SellerAuctionForm.jsx
// Path: C:\CFH\frontend\src\components\seller\SellerAuctionForm.jsx
// Purpose: Form for sellers to create a new auction
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/auction

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { createAuction } from '@services/api/auction';

const SellerAuctionForm = ({ sellerId }) => {
  const [title, setTitle] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [reservePrice, setReservePrice] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createAuction({
        sellerId,
        title,
        vehicleDetails,
        reservePrice: parseFloat(reservePrice),
        endDate
      });
      setSuccess('Auction created successfully!');
      logger.info(`[SellerAuctionForm] Auction created for sellerId: ${sellerId}`);
      setTitle('');
      setVehicleDetails('');
      setReservePrice('');
      setEndDate('');
    } catch (err) {
      logger.error(`[SellerAuctionForm] Failed to create auction for sellerId ${sellerId}: ${err.message}`, err);
      setError('Failed to create auction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create New Auction</h2>
      {error && <div className="text-center text-red-600 bg-red-100 border border-red-300 rounded-md mb-4" role="alert">{error}</div>}
      {success && <div className="text-center text-green-600 bg-green-100 border border-green-300 rounded-md mb-4" role="alert">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Auction Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter auction title"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="vehicleDetails" className="block text-sm font-medium text-gray-700">Vehicle Details</label>
          <textarea
            id="vehicleDetails"
            value={vehicleDetails}
            onChange={(e) => setVehicleDetails(e.target.value)}
            placeholder="Enter vehicle details"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="reservePrice" className="block text-sm font-medium text-gray-700">Reserve Price ($)</label>
          <input
            id="reservePrice"
            type="number"
            value={reservePrice}
            onChange={(e) => setReservePrice(e.target.value)}
            placeholder="Enter reserve price"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Auction'}
        </button>
      </form>
    </div>
  );
};

SellerAuctionForm.propTypes = { sellerId: PropTypes.string.isRequired };
export default SellerAuctionForm;