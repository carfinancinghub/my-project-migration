import React, { useState } from 'react';

const SellerPricingTool = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSuggestedPrice = async () => {
    setLoading(true);
    setError('');
    setSuggestedPrice(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/listings/suggest-price?make=${make}&model=${model}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to fetch price data');

      const data = await res.json();
      setSuggestedPrice(data.suggestedPrice);
    } catch (err) {
      setError('Unable to fetch suggested price. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">💡 Seller Pricing Suggestion Tool</h2>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Car Make (e.g., Toyota)"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <input
          type="text"
          placeholder="Car Model (e.g., Camry)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <input
          type="number"
          placeholder="Year (e.g., 2020)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <button
          onClick={fetchSuggestedPrice}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : '🔍 Get Suggested Price'}
        </button>
      </div>

      {suggestedPrice && (
        <div className="mt-4 bg-green-100 border-l-4 border-green-500 p-3 rounded text-green-800">
          Suggested Listing Price: <strong>${suggestedPrice.toLocaleString()}</strong>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600">{error}</div>
      )}
    </div>
  );
};

export default SellerPricingTool;