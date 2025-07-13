// File: BookingModal.jsx
// Path: frontend/src/components/hauler/BookingModal.jsx
// Author: Cod3 (05082141, May 08, 2025, 21:41 PDT)
// Purpose: Reusable modal for confirming transport bookings, updating gamification XP, transport history, and loyalty badges, with social sharing for Enterprise users

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@components/common/Button';
import { toast } from 'react-toastify';
import { logError } from '@utils/logger';
import { awardLoyaltyBadge } from '@utils/gamificationUtils';
import { generateShareContent, shareToPlatform } from '@utils/SocialShareHelper';
import PremiumFeature from '@components/common/PremiumFeature';

// === Booking Modal Component ===
const BookingModal = ({ transport, isOpen, onClose, onConfirm, transportHistory, isPremium }) => {
  // === State Setup ===
  const [isLoading, setIsLoading] = useState(false);

  // === Confirm Booking ===
  const handleConfirmBooking = useCallback(async () => {
    if (!transport) return;
    setIsLoading(true);
    try {
      const updatedHistory = [...transportHistory, transport];
      const newBadge = awardLoyaltyBadge(updatedHistory.length);
      onConfirm(updatedHistory, newBadge);
      toast.success(`Booking confirmed! Transport ID: ${transport.id}`);

      // Enterprise: Share booking confirmation
      if (isPremium && newBadge) {
        const content = generateShareContent('badge', { badge: newBadge });
        await shareToPlatform('twitter', content);
      }
    } catch (err) {
      logError(err);
      toast.error('Failed to confirm booking.');
    } finally {
      setIsLoading(false);
      onClose();
    }
  }, [transport, transportHistory, isPremium, onConfirm, onClose]);

  // === Render ===
  if (!isOpen || !transport) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="booking-modal-title"
    >
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 id="booking-modal-title" className="text-lg font-semibold text-gray-800 mb-4">
          Confirm Booking
        </h3>
        <div className="mb-4">
          <p><strong>Type:</strong> {transport.type}</p>
          <p><strong>Price:</strong> ${transport.price.toFixed(2)}</p>
          <p><strong>ID:</strong> {transport.id}</p>
        </div>
        <div className="flex gap-4 justify-end">
          <Button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 hover:bg-gray-400"
            disabled={isLoading}
            aria-label="Cancel booking"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmBooking}
            className="bg-green-500 text-white hover:bg-green-600"
            disabled={isLoading}
            aria-label="Confirm booking"
          >
            {isLoading ? 'Confirming...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingModal;