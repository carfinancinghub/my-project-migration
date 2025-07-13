// File: StorageAssignmentForm.jsx
// Path: frontend/src/components/storage/StorageAssignmentForm.jsx
// Purpose: Form UI to assign items to storage slots
// Author: Cod1 (05111359 - PDT)
// 👑 Cod2 Crown Certified

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';

/**
 * Functions Summary:
 * - submitAssignment(): Simulates storage slot assignment and logs the operation
 * Inputs: itemId, slotId
 * Outputs: UI message on success or error
 * Dependencies: logger
 */
const StorageAssignmentForm = ({ onSubmit }) => {
  const [itemId, setItemId] = useState('');
  const [slotId, setSlotId] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      onSubmit(itemId, slotId);
      setMessage('Assignment successful.');
    } catch (error) {
      logger.error('Storage assignment failed:', error);
      setMessage('Assignment failed.');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Assign Storage Slot</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item ID"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          className="border p-1 mb-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Slot ID"
          value={slotId}
          onChange={(e) => setSlotId(e.target.value)}
          className="border p-1 mb-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Assign
        </button>
      </form>
      {message && <div className="mt-4">{message}</div>}
    </div>
  );
};

StorageAssignmentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default StorageAssignmentForm;