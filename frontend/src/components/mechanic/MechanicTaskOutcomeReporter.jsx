/**
 * File: MechanicTaskOutcomeReporter.jsx
 * Path: frontend/src/components/mechanic/MechanicTaskOutcomeReporter.jsx
 * Purpose: UI for mechanics to submit task outcomes and review impact on reputation
 * Author: Cod1 (05060835)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem } from '@/components/ui/select';

/**
 * MechanicTaskOutcomeReporter Component
 * Purpose: Submit outcome reports tied to task completions
 * Props:
 *  - taskId: string (required)
 */
const MechanicTaskOutcomeReporter = ({ taskId }) => {
  const [status, setStatus] = useState('successful');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /**
   * handleSubmit
   * Purpose: POST task outcome to API
   */
  const handleSubmit = async () => {
    if (!taskId) return toast.error('Missing task ID');
    setSubmitting(true);
    try {
      const res = await axios.post('/api/mechanic/tasks/report', {
        taskId,
        status,
        notes,
      });
      toast.success('Task outcome reported');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Report Task Outcome</h2>
      <Select label="Outcome Status" value={status} onValueChange={setStatus}>
        <SelectItem value="successful">Successful</SelectItem>
        <SelectItem value="partial">Partial</SelectItem>
        <SelectItem value="failed">Failed</SelectItem>
      </Select>
      <Textarea
        placeholder="Add any important notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button disabled={submitting} onClick={handleSubmit}>
        Submit Outcome
      </Button>
    </div>
  );
};

export default MechanicTaskOutcomeReporter;
