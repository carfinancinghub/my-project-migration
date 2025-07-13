// File: SupportTicketForm.jsx
// Path: frontend/src/components/support/SupportTicketForm.jsx
// Purpose: Form to submit support tickets with premium gamification options
// Author: Rivers Auction Team
// Editor: Cod1 (05141418 - PDT) — Added AI category suggestion, FileUploader, LoyaltyBoostChecker
// 👑 Cod2 Crown Certified

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { suggestTicketCategory } from '@services/ai/TicketClassifier';
import FileUploader from '@components/common/FileUploader';
import LoyaltyBoostChecker from '@components/common/LoyaltyBoostChecker';

/**
 * Functions Summary:
 * - handleSubmit(): Submit support ticket (with optional file & priority).
 * - suggestCategory(): Suggests category based on description (premium).
 * Inputs: userId (string), isPremium (bool)
 * Outputs: JSX form with dynamic inputs and feedback
 * Dependencies: @services/ai/TicketClassifier, @components/common/FileUploader, @components/common/LoyaltyBoostChecker
 */
const SupportTicketForm = ({ userId, isPremium }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [priorityBoost, setPriorityBoost] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (isPremium && description.length > 10) {
      suggestTicketCategory(description)
        .then(setSuggestedCategory)
        .catch((err) => {
          logger.error('AI category suggestion failed:', err);
        });
    }
  }, [description, isPremium]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId,
        subject,
        description,
        category: isPremium && suggestedCategory ? suggestedCategory : category,
        priorityBoost: isPremium ? priorityBoost : false,
        fileName: file?.name || null,
      };
      // Simulated POST call
      logger.info('Ticket submitted:', payload);
      setStatus('Submitted successfully.');
    } catch (error) {
      logger.error('Support ticket submission failed:', error);
      setStatus('Submission failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow space-y-3">
      <h2 className="text-lg font-bold">Submit Support Ticket</h2>
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="border w-full p-2"
        required
      />
      <textarea
        placeholder="Describe your issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border w-full p-2"
        rows={4}
        required
      />
      {isPremium && suggestedCategory && (
        <div className="text-sm text-gray-600">Suggested Category: {suggestedCategory}</div>
      )}
      <input
        type="text"
        placeholder="Custom Category (optional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border w-full p-2"
      />
      {isPremium ? (
        <>
          <FileUploader onUpload={setFile} />
          <LoyaltyBoostChecker
            isPremium={isPremium}
            onToggle={(checked) => setPriorityBoost(checked)}
          />
        </>
      ) : (
        <div className="text-sm text-yellow-600">Premium support tools available on upgrade</div>
      )}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Ticket
      </button>
      {status && <div className="text-sm mt-2">{status}</div>}
    </form>
  );
};

SupportTicketForm.propTypes = {
  userId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default SupportTicketForm;