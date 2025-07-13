import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BidDisplay from '@components/common/BidDisplay';
import PredictionEngine from '@services/ai/PredictionEngine';
import BidUpdates from '@services/websocket/BidUpdates';
import logger from '@utils/logger';

// 👑 Crown Certified Component
// Path: frontend/src/components/bidding/CompetitiveBiddingInterface.jsx
// Purpose: Real-time interface for buyers to view and select lender/provider bids
// Author: Rivers Auction Team
// Date: May 17, 2025
// Cod2 Crown Certified

const CompetitiveBiddingInterface = ({ auctionId, userId, isPremium }) => {
  const [bids, setBids] = useState([]);
  const [valuations, setValuations] = useState({});
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = BidUpdates.connect('/ws/bids/updates');

    socket.on('bidUpdate', (data) => {
      if (data.auctionId === auctionId) {
        setBids((prev) => [...prev, data.bid].slice(-100)); // Keep last 100 bids
        if (isPremium) {
          fetchValuation(data.bid);
          checkMatchingPreferences(data.bid);
        }
      }
    });

    socket.on('error', (err) => {
      logger.error(`WebSocket error for auction ${auctionId}: ${err.message}`);
      setError('Failed to fetch bid updates');
    });

    fetchInitialBids();

    return () => socket.disconnect();
  }, [auctionId, isPremium]);

  const fetchInitialBids = async () => {
    try {
      const response = await PredictionEngine.getBids(auctionId);
      setBids(response.data.slice(-100));
      if (isPremium) {
        setCurrency(response.userCurrency || 'USD');
        response.data.forEach(fetchValuation);
      }
    } catch (err) {
      logger.error(`Failed to fetch bids for auction ${auctionId}: ${err.message}`);
      setError('Unable to load bids');
    }
  };

  const fetchValuation = async (bid) => {
    try {
      const valuation = await PredictionEngine.getBidValuation(bid.id);
      setValuations((prev) => ({
        ...prev,
        [bid.id]: { price: valuation.price, recommendation: isPremium ? valuation.recommendation : null },
      }));
    } catch (err) {
      logger.error(`Failed to fetch valuation for bid ${bid.id}: ${err.message}`);
    }
  };

  const checkMatchingPreferences = (bid) => {
    PredictionEngine.matchPreferences(userId, bid).then((match) => {
      if (match.isRelevant) {
        setNotifications((prev) => [
          ...prev,
          { id: bid.id, message: `New bid matches your preferences: ${bid.amount} ${currency}` },
        ].slice(-5)); // Keep last 5 notifications
      }
    }).catch((err) => {
      logger.error(`Preference match error for user ${userId}: ${err.message}`);
    });
  };

  const handleSelectBid = async (bidId) => {
    try {
      await PredictionEngine.selectBid(auctionId, bidId);
      setBids((prev) => prev.filter((bid) => bid.id !== bidId));
    } catch (err) {
      logger.error(`Failed to select bid ${bidId}: ${err.message}`);
      setError('Unable to select bid');
    }
  };

  return (
    <div className="competitive-bidding-interface">
      <BidDisplay
        bids={bids}
        valuations={valuations}
        currency={currency}
        error={error}
        onSelectBid={handleSelectBid}
      />
      {isPremium && (
        <div className="notifications">
          {notifications.map((note, index) => (
            <div key={index} className="notification">
              {note.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

CompetitiveBiddingInterface.propTypes = {
  auctionId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default CompetitiveBiddingInterface;