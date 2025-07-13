// File: SellerOfferTracker.jsx
// Path: frontend/src/components/seller/SellerOfferTracker.jsx
// Purpose: Display and manage incoming offers on seller's listings
// 👑 Cod2 Crown Certified

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx';
import Card from '@/components/common/Card.jsx';
import Button from '@/components/common/Button.jsx';
import { theme } from '@/styles/theme';

const SellerOfferTracker = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/seller/incoming-offers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedOffers = res.data.sort(
          (a, b) => new Date(b.offerDate) - new Date(a.offerDate)
        );
        setOffers(sortedOffers);
      } catch (err) {
        console.error('Error fetching incoming offers:', err);
        setError('❌ Failed to load offers');
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleAccept = async (offerId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/seller/offers/${offerId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOffers(offers.filter((offer) => offer._id !== offerId));
      alert('✅ Offer accepted!');
    } catch (err) {
      console.error('Error accepting offer:', err);
      alert('❌ Failed to accept offer');
    }
  };

  const handleDecline = async (offerId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/seller/offers/${offerId}/decline`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOffers(offers.filter((offer) => offer._id !== offerId));
      alert('✅ Offer declined!');
    } catch (err) {
      console.error('Error declining offer:', err);
      alert('❌ Failed to decline offer');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className={theme.errorText}>{error}</div>;

  return (
    <ErrorBoundary>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">💰 Incoming Offers</h2>

        {offers.length === 0 ? (
          <p className="text-gray-500">No incoming offers found.</p>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <Card key={offer._id} className="hover:shadow-md">
                <div className="flex justify-between items-center p-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">
                      {offer.carModel} ({offer.carYear})
                    </p>
                    <p className="text-sm text-gray-600">
                      Offer Amount: ${offer.offerAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Offer Date: {new Date(offer.offerDate).toLocaleString()}
                    </p>
                    {offer.buyerId && (
                      <p className="text-sm text-gray-600">Buyer ID: {offer.buyerId}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="primary" onClick={() => handleAccept(offer._id)}>
                      Accept
                    </Button>
                    <Button variant="secondary" onClick={() => handleDecline(offer._id)}>
                      Decline
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default SellerOfferTracker;
