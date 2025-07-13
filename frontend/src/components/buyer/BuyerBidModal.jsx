// 👑 Crown Certified Component — BuyerBidModal.jsx
// Path: frontend/src/components/buyer/BuyerBidModal.jsx
// Purpose: AI-driven bidding modal for buyers with premium insights and submission controls
// Author: Rivers Auction Team — May 18, 2025
// Cod2 Crown Certified

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PredictionEngine from '@services/ai/PredictionEngine';
import logger from '@utils/logger';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@components/common/Dialog';
import Button from '@components/common/Button';

const BuyerBidModal = ({ auctionId, isOpen, onClose, onSubmit, isPremium }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [suggestedBid, setSuggestedBid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isPremium && isOpen) {
      fetchBidSuggestion();
    }
  }, [auctionId, isPremium, isOpen]);

  const fetchBidSuggestion = async () => {
    try {
      setLoading(true);
      const response = await PredictionEngine.getRecommendation({ auctionId });
      setSuggestedBid(response?.suggestedBid);
      setHistory(response?.history || []);
    } catch (err) {
      logger.error('Failed to fetch bid suggestion', err);
      setError('Unable to retrieve AI suggestion.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!bidAmount) return setError('Please enter a valid bid.');
    onSubmit(Number(bidAmount));
    setBidAmount('');
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogTitle>🚗 Place Your Bid</DialogTitle>
      <DialogContent>
        <input
          type="number"
          placeholder="Enter your bid amount"
          className="w-full p-2 border rounded"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
        />
        {isPremium && suggestedBid && (
          <div className="mt-2 text-green-600">
            🤖 AI Suggests: <strong>${suggestedBid}</strong>
          </div>
        )}
        {isPremium && history.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            <h4 className="font-semibold">📜 Bid History (AI)</h4>
            <ul className="list-disc pl-5">
              {history.map((h, idx) => (
                <li key={idx}>${h}</li>
              ))}
            </ul>
          </div>
        )}
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit Bid
        </Button>
      </DialogActions>
    </Dialog>
  );
};

BuyerBidModal.propTypes = {
  auctionId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default BuyerBidModal;
