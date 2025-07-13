// File: FinancingOffer.js
// Path: frontend/src/components/buyer/FinancingOffer.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../common/Navbar';

const FinancingOffer = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    axios.get('/api/loans').then(res => setOffers(res.data));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Financing Offers</h1>
        <div className="grid gap-4">
          {offers.map(offer => (
            <div key={offer._id} className="border p-4 rounded">
              <h2 className="text-lg">{offer.lender}</h2>
              <p>Amount: ${offer.amount}</p>
              <p>Rate: {offer.rate}%</p>
              <p>Term: {offer.term} months</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Accept Offer</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancingOffer;