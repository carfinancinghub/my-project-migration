// File: CryptoPaymentOption.jsx
// Path: C:\CFH\frontend\src\components\blockchain\CryptoPaymentOption.jsx
// Purpose: Allow users to pay with cryptocurrency
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/blockchain

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { processCryptoPayment } from '@services/api/blockchain';

const CryptoPaymentOption = ({ userId, auctionId, amount }) => {
  const [currency, setCurrency] = useState('BTC');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const result = await processCryptoPayment(userId, auctionId, amount, currency);
      setTxHash(result.txHash);
      logger.info(`[CryptoPaymentOption] Processed crypto payment for userId: ${userId}, auctionId: ${auctionId}`);
    } catch (err) {
      logger.error(`[CryptoPaymentOption] Failed to process crypto payment for userId ${userId}: ${err.message}`, err);
      setError('Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Pay with Cryptocurrency</h3>
      {error && <div className="p-2 text-red-600 bg-red-100 border border-red-300 rounded-md mb-2" role="alert">{error}</div>}
      {txHash ? (
        <div className="text-green-600">
          Payment successful! Transaction Hash: <span className="font-medium">{txHash}</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="currency">Select Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
            </select>
          </div>
          <p className="text-gray-600">Amount: <span className="font-medium">${amount}</span></p>
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Pay with Crypto'}
          </button>
        </div>
      )}
    </div>
  );
};

CryptoPaymentOption.propTypes = {
  userId: PropTypes.string.isRequired,
  auctionId: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired
};

export default CryptoPaymentOption;