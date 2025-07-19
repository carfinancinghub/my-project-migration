/**
 * © 2025 CFH, All Rights Reserved
 * File: TitleVerificationForm.tsx
 * Path: frontend/src/components/title/TitleVerificationForm.tsx
 * Purpose: Form for verifying title records with status and notes
 * Author: Cod1 Team
 * Date: 2025-07-18 [0815]
 * Version: 1.0.1
 * Version ID: 3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: 3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k
 * Save Location: frontend/src/components/title/TitleVerificationForm.tsx
 */

import React, { useState, FormEvent } from 'react';
import Button from '@common/Button';
import LoadingSpinner from '@common/LoadingSpinner';
import { theme } from '@styles/theme';
import { titleVerificationSchema } from '@validation/title.validation';
import { verifyTitle } from '@services/title';

interface TitleVerificationFormProps {
  job: { _id: string; status?: string; notes?: string };
  onComplete: () => void;
}

const TitleVerificationForm: React.FC<TitleVerificationFormProps> = ({ job, onComplete }) => {
  const [status, setStatus] = useState(job.status || 'Pending');
  const [notes, setNotes] = useState(job.notes || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await titleVerificationSchema.validateAsync({ status, notes });
      await verifyTitle(job._id, status, notes, token);
      onComplete();
    } catch (err: any) {
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
          onChange={e => setStatus(e.target.value)}
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
          onChange={e => setNotes(e.target.value)}
          rows={4}
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
