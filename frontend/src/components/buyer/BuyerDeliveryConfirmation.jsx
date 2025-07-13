// File: BuyerDeliveryConfirmation.jsx
// Path: frontend/src/components/buyer/BuyerDeliveryConfirmation.jsx
// 👑 Cod1 Crown Certified — Delivery Confirmation Module (Buyer View)

import React, { useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';

// 🌟 BuyerDeliveryConfirmation: Confirm when your car has arrived safely
const BuyerDeliveryConfirmation = () => {
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmDelivery = async () => {
    setLoading(true);
    try {
      // Simulate backend call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setDeliveryConfirmed(true);
    } catch (error) {
      console.error('Error confirming delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {!deliveryConfirmed ? (
        <>
          <p className="text-gray-700 mb-4">
            Once your vehicle arrives and you’ve verified everything is in order,
            please confirm delivery.
          </p>
          <button
            onClick={handleConfirmDelivery}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            Confirm Delivery
          </button>
        </>
      ) : (
        <p className="text-green-700 font-semibold">
          🎉 Delivery Confirmed! Thank you for using our platform.
        </p>
      )}
    </div>
  );
};

export default BuyerDeliveryConfirmation;
