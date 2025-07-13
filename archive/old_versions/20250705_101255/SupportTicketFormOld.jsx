// File: SupportTicketForm.jsx
// Path: frontend/src/components/support/SupportTicketForm.jsx
// Purpose: Support ticket form for users with premium options like file upload and priority boost
// Author: Rivers Auction Team
// Editor: Cod1 (05132128 - PDT) — Added AI suggestion, file upload, and loyalty-based priority boost
// 👑 Cod2 Crown Certified

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import FileUploader from '@components/common/FileUploader';
import LoyaltyBoostChecker from '@components/common/LoyaltyBoostChecker';
import { getSuggestedCategory } from '@services/ai/TicketClassifier';

/**
 * Functions Summary:
 * - handleSubmit(): Handles form submission and error capture
 * - getSuggestedCategory(): AI helper for suggested issue categories
 * Inputs: userId (string), isPremium (bool)
 * Outputs: UI confirmation or error messages
 * Dependencies: logger, TicketClassifier, FileUploader, LoyaltyBoostChecker
 */
const SupportTicketForm = ({ userId, isPremium }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [priorityBoost, setPriorityBoost] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const suggest = async () => {
      try {
        const suggestion = await getSuggestedCategory(description);
        setSuggestedCategory(suggestion);
      } catch (err) {
        logger.error('AI category suggestion failed:', err);
      }
    };
    if (description.length > 15 && isPremium) suggest();
  }, [description, isPremium]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus('Submitting...');
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setStatus('Ticket submitted successfully.');
    } catch (err) {
      logger.error('Ticket submission failed:', err);
      setStatus('Failed to submit ticket.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Submit a Support Ticket</h2>
      <input
        type="text"
        placeholder="Subject"
        className="w-full border p-2"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <textarea
        placeholder="Describe your issue..."
        className="w-full border p-2"
        rows="5"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      {isPremium && suggestedCategory && (
        <p className="text-sm text-blue-600">Suggested Category: {suggestedCategory}</p>
      )}
      <label className="block">
        Category:
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border mt-1 p-2"
        >
          <option>General</option>
          <option>Payment</option>
          <option>Logistics</option>
          <option>Escrow</option>
        </select>
      </label>
      {isPremium ? (
        <>
          <FileUploader onUpload={setFile} />
          <LoyaltyBoostChecker isPremium={isPremium} checked={priorityBoost} onChange={setPriorityBoost} />
        </>
      ) : (
        <p className="text-sm text-yellow-600">Premium support features unavailable. Upgrade to unlock file uploads and priority handling.</p>
      )}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
      {status && <div className="mt-2 text-sm">{status}</div>}
    </form>
  );
};

SupportTicketForm.propTypes = {
  userId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default SupportTicketForm;