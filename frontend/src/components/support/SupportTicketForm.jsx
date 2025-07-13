// File: SupportTicketForm.jsx
// Path: C:\CFH\frontend\src\components\support\SupportTicketForm.jsx
// Purpose: Support ticket submission
// Author: Rivers Auction Dev Team
// Date: 2025-05-23
// Cod2 Crown Certified: Yes
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import api from '@services/api/support';

const SupportTicketForm = ({ userId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.submitTicket({ userId, title, description });
      setTitle(''); setDescription('');
    } catch (err) {
      logger.error('Failed to submit ticket:', err);
      setError('Submission failed. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Submit a Support Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter ticket title"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your issue"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

SupportTicketForm.propTypes = { userId: PropTypes.string.isRequired };
export default SupportTicketForm;