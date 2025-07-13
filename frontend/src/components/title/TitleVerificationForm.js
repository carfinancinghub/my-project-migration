// File: TitleVerificationForm.js
// Path: frontend/src/components/title/TitleVerificationForm.js

import React, { useState } from 'react';
import axios from 'axios';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const TitleVerificationForm = ({ job, onComplete }) => {
  const [status, setStatus] = useState(job.status || 'Pending');
  const [notes, setNotes] = useState(job.notes || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/title/${job._id}/verify`,
        { status, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onComplete();
    } catch (err) {
      console.error('Failed to submit title verification:', err);
      setError('❌ Unable to update title job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border rounded p-4 shadow bg-white"
      aria-label="Title Verification Form"
    >
      <h2 className="text-lg font-semibold">📄 Verify Title Record</h2>

      <div>
        <label htmlFor="status" className="block text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          aria-label="Select title status"
        >
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="4"
          placeholder="Optional notes or clarification..."
          className="w-full border px-3 py-2 rounded"
          aria-label="Notes for title verification"
        />
      </div>

      {error && <p className={theme.errorText}>{error}</p>}
      {submitting ? (
        <LoadingSpinner />
      ) : (
        <Button type="submit" aria-label="Submit title verification">
          ✅ Submit Update
        </Button>
      )}
    </form>
  );
};

export default TitleVerificationForm;
