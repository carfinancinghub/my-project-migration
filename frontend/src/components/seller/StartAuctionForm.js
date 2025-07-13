// File: StartAuctionForm.js
// Path: frontend/src/components/seller/StartAuctionForm.js

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const StartAuctionForm = ({ carId }) => {
  const [startingPrice, setStartingPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auctions/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ carId, startingPrice, duration }),
      });
      if (!res.ok) throw new Error('Auction start failed');
      alert('Auction started successfully!');
    } catch (err) {
      setError('Failed to start auction.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold">Start Auction for Car</h2>
      <Input
        type="number"
        placeholder="Starting Price ($)"
        value={startingPrice}
        onChange={(e) => setStartingPrice(e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Auction Duration (hrs)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit">Launch Auction</Button>
    </form>
  );
};

export default StartAuctionForm;
