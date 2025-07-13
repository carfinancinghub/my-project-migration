// File: MechanicInspectionForm.jsx
// Path: frontend/src/components/mechanic/MechanicInspectionForm.jsx
// Purpose: Form UI for mechanics to inspect vehicles and feed gamified progress to seller reputation
// Author: Rivers Auction Team
// Editor: Cod1 (05140439 - PDT)
// Edits: Created new file. Added form logic for inspection, gamification triggers, PropTypes, and logger.
// 👑 Cod2 Crown Certified

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { reportInspectionResult } from '@services/mechanic/InspectionService';
import { updateMechanicBadgeProgress } from '@services/gamification/MechanicBadgeEngine';

/**
 * Functions Summary:
 * - handleInspectionSubmit(): Submits inspection form and logs mechanic gamification
 * - Inputs: vehicleId, inspection rating (pass/needs attention/critical)
 * - Outputs: UI feedback message and badge trigger
 * - Dependencies: @services/mechanic/InspectionService, @services/gamification/MechanicBadgeEngine, logger
 */

const MechanicInspectionForm = ({ vehicleId, mechanicId, onComplete }) => {
  const [rating, setRating] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const handleInspectionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!rating) throw new Error('Rating is required.');

      await reportInspectionResult({ vehicleId, mechanicId, rating, notes });
      await updateMechanicBadgeProgress(mechanicId, 'inspection_submitted');

      setMessage('Inspection submitted successfully!');
      onComplete && onComplete();
    } catch (err) {
      logger.error('Inspection submission failed:', err);
      setMessage('Failed to submit inspection.');
    }
  };

  return (
    <form onSubmit={handleInspectionSubmit} className="p-4 bg-gray-50 rounded shadow space-y-4">
      <h3 className="text-lg font-semibold">Vehicle Inspection</h3>

      <label className="block">
        Rating:
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 w-full mt-1"
          required
        >
          <option value="">-- Select Rating --</option>
          <option value="pass">✅ Passed</option>
          <option value="attention">⚠️ Needs Attention</option>
          <option value="critical">❌ Critical</option>
        </select>
      </label>

      <label className="block">
        Notes (optional):
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 w-full mt-1"
          rows={3}
        />
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Inspection
      </button>

      {message && (
        <p className="text-sm mt-2 text-center text-gray-700">{message}</p>
      )}
    </form>
  );
};

MechanicInspectionForm.propTypes = {
  vehicleId: PropTypes.string.isRequired,
  mechanicId: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
};

export default MechanicInspectionForm;