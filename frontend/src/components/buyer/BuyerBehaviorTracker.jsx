/**
 * BuyerBehaviorTracker.jsx
 * Path: frontend/src/components/buyer/BuyerBehaviorTracker.jsx
 * Purpose: Track buyer actions (views, searches) to feed AI suggestions with offline storage.
 * 👑 Cod2 Crown Certified
 */

import React, { useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const BuyerBehaviorTracker = ({ buyerId, action, details }) => {
  // Store action in localStorage and send to backend
  useEffect(() => {
    if (!action || !details) return;

    const storeAndSendAction = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // Silently skip if not authenticated

        // Store in localStorage for offline resilience
        const storedActions = JSON.parse(localStorage.getItem('buyerActions') || '[]');
        const newAction = { buyerId, action, details, timestamp: new Date().toISOString() };
        storedActions.push(newAction);
        localStorage.setItem('buyerActions', JSON.stringify(storedActions));

        // Send to backend
        await axios.post(
          `/api/buyer/behavior`,
          { buyerId, action, details },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Clear sent action from localStorage
        const updatedActions = storedActions.filter(
          (a) => a.timestamp !== newAction.timestamp
        );
        localStorage.setItem('buyerActions', JSON.stringify(updatedActions));
      } catch (err) {
        // Silently store action for retry later
        console.error('Failed to send behavior:', err);
      }
    };

    storeAndSendAction();
  }, [buyerId, action, details]);

  // Sync stored actions on mount
  useEffect(() => {
    const syncStoredActions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const storedActions = JSON.parse(localStorage.getItem('buyerActions') || '[]');
        if (storedActions.length === 0) return;

        for (const storedAction of storedActions) {
          await axios.post(
            `/api/buyer/behavior`,
            {
              buyerId: storedAction.buyerId,
              action: storedAction.action,
              details: storedAction.details,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }

        // Clear synced actions
        localStorage.setItem('buyerActions', '[]');
      } catch (err) {
        console.error('Failed to sync stored actions:', err);
      }
    };

    syncStoredActions();
  }, []);

  return null; // No UI, runs in background
};

BuyerBehaviorTracker.propTypes = {
  buyerId: PropTypes.string.isRequired,
  action: PropTypes.string,
  details: PropTypes.object,
};

export default BuyerBehaviorTracker;