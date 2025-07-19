/**
 * © 2025 CFH, All Rights Reserved
 * File: StartAuctionForm.tsx
 * Path: frontend/src/components/seller/StartAuctionForm.tsx
 * Purpose: Form component for starting an auction with starting price and duration
 * Author: Cod1 Team
 * Date: 2025-07-18 [0815]
 * Version: 1.0.1
 * Version ID: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
 * Save Location: frontend/src/components/seller/StartAuctionForm.tsx
 */

/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with typed state and props
 * - Added validation for startingPrice and duration using @validation/auction.validation
 * - Moved API call to @services/auction for modularity and testability
 * - Added authentication check with token from context (placeholder, replace localStorage)
 * - Added loading state and error toast notifications
 * - Suggest unit tests in __tests__/components/seller/StartAuctionForm.test.tsx
 * - Suggest: Use controlled UI components for better accessibility
 * - Improved: Typed handleSubmit and form elements
 * - Further: Suggest debounce on submit for multiple clicks prevention
 */

import React, { useState, FormEvent } from 'react';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { toast } from 'react-toastify'; // Assume installed for toasts
import { auctionStartValidation } from '@validation/auction.validation'; // Joi/Yup schema assumed
import { startAuction } from '@services/auction'; // Extracted service

interface StartAuctionFormProps {
  carId: string;
}

const StartAuctionForm: React.FC<StartAuctionFormProps> = ({ carId }) => {
  const [startingPrice, setStartingPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return; // Debounce prevention
    setLoading(true);
    setError('');
    try {
      await auctionStartValidation.validate({ startingPrice, duration });
      // Placeholder: Token from context
      // const token = useAuth().token;
      const token = localStorage.getItem('token');
      await startAuction(carId, startingPrice, duration, token);
      toast.success('Auction started successfully!');
    } catch (err: any) {
      const errMsg = err.message || 'Failed to start auction.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold">Start Auction for Car</h2>
      <input
        type="number"
        placeholder="Starting Price ($)"
        value={startingPrice}
        onChange={e => setStartingPrice(e.target.value)}
        required
        aria-label="Starting Price"
      />
      <input
        type="number"
        placeholder="Auction Duration (hrs)"
        value={duration}
        onChange={e => setDuration(e.target.value)}
        required
        aria-label="Auction Duration"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={loading} aria-disabled={loading}>
        {loading ? 'Launching...' : 'Launch Auction'}
      </button>
    </form>
  );
};

export default StartAuctionForm;
