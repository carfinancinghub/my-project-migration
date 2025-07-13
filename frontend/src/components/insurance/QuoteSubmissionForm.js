// File: QuoteSubmissionForm.js
// Path: frontend/src/components/insurance/QuoteSubmissionForm.js

import React, { useState } from 'react';
import axios from 'axios';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const QuoteSubmissionForm = ({ vehicleId, onQuoteSubmitted }) => {
  const [policyType, setPolicyType] = useState('Comprehensive');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [duration, setDuration] = useState('12');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/insurance/quote`,
        {
          vehicleId,
          policyType,
          quoteAmount: parseFloat(quoteAmount),
          duration: parseInt(duration),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onQuoteSubmitted();
    } catch (err) {
      console.error('Quote submission failed:', err);
      setError('❌ Failed to submit quote');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow bg-white">
      <h2 className="text-lg font-semibold">📋 Submit Insurance Quote</h2>

      <div>
        <label htmlFor="policyType" className="block text-sm font-medium">Policy Type</label>
        <select
          id="policyType"
          value={policyType}
          onChange={(e) => setPolicyType(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="Comprehensive">Comprehensive</option>
          <option value="Collision">Collision</option>
          <option value="Liability">Liability Only</option>
        </select>
      </div>

      <div>
        <label htmlFor="quoteAmount" className="block text-sm font-medium">Quote Amount ($)</label>
        <input
          id="quoteAmount"
          type="number"
          min="0"
          required
          value={quoteAmount}
          onChange={(e) => setQuoteAmount(e.target.value)}
          className="w-full border px-3 py-1 rounded"
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium">Duration (months)</label>
        <input
          id="duration"
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full border px-3 py-1 rounded"
        />
      </div>

      {error && <p className={theme.errorText}>{error}</p>}
      {submitting ? (
        <LoadingSpinner />
      ) : (
        <Button type="submit">💾 Submit Quote</Button>
      )}
    </form>
  );
};

export default QuoteSubmissionForm;
