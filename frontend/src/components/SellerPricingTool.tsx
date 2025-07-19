/**
 * © 2025 CFH, All Rights Reserved
 * File: SellerPricingTool.tsx
 * Path: frontend/src/components/SellerPricingTool.tsx
 * Purpose: Tool for sellers to get suggested pricing based on car make, model, and year
 * Author: Cod1 Team
 * Date: 2025-07-18 [0815]
 * Version: 1.0.1
 * Version ID: q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6
 * Save Location: frontend/src/components/SellerPricingTool.tsx
 */

/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with typed state
 * - Added validation for make, model, year using @validation/pricing.validation
 * - Moved fetch to @services/pricing for modularity
 * - Handled auth token securely (context placeholder)
 * - Added debounce on input changes for API calls
 * - Suggest unit tests in __tests__/components/SellerPricingTool.test.tsx
 * - Suggest: Handle year as number for schema and user experience
 * - Improved: Typed handle functions, added currency formatting
 * - Further: Suggest auto-suggest for make/model from API
 */

import React, { useState, useEffect, ChangeEvent } from 'react';
import { pricingValidation } from '@validation/pricing.validation'; // Assumed
import { getSuggestedPrice } from '@services/pricing'; // Extracted
import debounce from 'lodash/debounce'; // Assume installed

const SellerPricingTool: React.FC = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const debouncedFetch = debounce(async () => {
    setLoading(true);
    setError('');
    setSuggestedPrice(null);

    try {
      await pricingValidation.validate({ make, model, year });
      const token = localStorage.getItem('token');
      const data = await getSuggestedPrice(make, model, year, token);
      setSuggestedPrice(data.suggestedPrice);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch suggested price. Please try again.');
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    if (make && model && year) debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [make, model, year]);

  return (
    <div className="p-4 bg-white shadow rounded max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">💡 Seller Pricing Suggestion Tool</h2>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Car Make (e.g., Toyota)"
          value={make}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setMake(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Car Model (e.g., Camry)"
          value={model}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setModel(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="number"
          placeholder="Year (e.g., 2020)"
          value={year}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setYear(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={debouncedFetch}
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
