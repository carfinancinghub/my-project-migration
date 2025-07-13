import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';

const BuyerPreferencesForm = () => {
  const [preferredMake, setPreferredMake] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxInterestRate, setMaxInterestRate] = useState('');
  const [termMonths, setTermMonths] = useState('');
  const [downPaymentBudget, setDownPaymentBudget] = useState('');
  const [yearRangeMin, setYearRangeMin] = useState('');
  const [yearRangeMax, setYearRangeMax] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem('buyerPreferences')) || {};
    setPreferredMake(savedPrefs.preferredMake || '');
    setMaxPrice(savedPrefs.maxPrice || '');
    setMaxInterestRate(savedPrefs.maxInterestRate || '');
    setTermMonths(savedPrefs.termMonths || '');
    setDownPaymentBudget(savedPrefs.downPaymentBudget || '');
    setYearRangeMin(savedPrefs.yearRange?.[0] || '');
    setYearRangeMax(savedPrefs.yearRange?.[1] || '');
  }, []);

  const savePreferences = () => {
    const preferences = {
      preferredMake,
      maxPrice: Number(maxPrice),
      maxInterestRate: Number(maxInterestRate),
      termMonths: Number(termMonths),
      downPaymentBudget: Number(downPaymentBudget),
      yearRange: [Number(yearRangeMin), Number(yearRangeMax)],
    };

    if (maxPrice <= 0 || maxInterestRate <= 0 || termMonths <= 0 || downPaymentBudget < 0) {
      setMessage('❌ Please enter valid values (positive numbers)');
      return;
    }
    if (yearRangeMin < 1900 || yearRangeMax > new Date().getFullYear() || yearRangeMin > yearRangeMax) {
      setMessage('❌ Please enter a valid year range');
      return;
    }

    localStorage.setItem('buyerPreferences', JSON.stringify(preferences));
    setMessage('✅ Preferences saved! Check your Smart Recommendations.');
  };

  return (
    <div className="buyer-preferences-form">
      <Navbar />
      <div className="max-w-xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-xl font-bold mb-4">🛠️ Set Your Preferences</h2>
        {message && <p className="mb-4 text-sm text-red-600">{message}</p>}

        <div className="space-y-4">
          <div>
            <label className="block font-medium">Preferred Make</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={preferredMake}
              onChange={(e) => setPreferredMake(e.target.value)}
              placeholder="e.g., Toyota"
            />
          </div>

          <div>
            <label className="block font-medium">Maximum Price ($)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              min="0"
              step="1"
            />
          </div>

          <div>
            <label className="block font-medium">Maximum Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded"
              value={maxInterestRate}
              onChange={(e) => setMaxInterestRate(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block font-medium">Term Length (Months)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={termMonths}
              onChange={(e) => setTermMonths(Number(e.target.value))}
              min="1"
              max="360"
            />
          </div>

          <div>
            <label className="block font-medium">Down Payment Budget ($)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={downPaymentBudget}
              onChange={(e) => setDownPaymentBudget(Number(e.target.value))}
              min="0"
              step="1"
            />
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block font-medium">Year Range (Min)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={yearRangeMin}
                onChange={(e) => setYearRangeMin(Number(e.target.value))}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
            <div>
              <label className="block font-medium">Year Range (Max)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={yearRangeMax}
                onChange={(e) => setYearRangeMax(Number(e.target.value))}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <button
            onClick={savePreferences}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerPreferencesForm;