/**
 * File: MechanicTaskReporter.jsx
 * Path: frontend/src/components/mechanic/MechanicTaskReporter.jsx
 * Purpose: UI component for submitting mechanic task outcome reports to backend
 * Author: Cod1 (05060816)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * MechanicTaskReporter Component
 * Purpose: Allows mechanics to submit task completion feedback and status
 * Props:
 *   - taskId (string): The unique ID of the task being reported
 */
const MechanicTaskReporter = ({ taskId }) => {
  const [status, setStatus] = useState('successful');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/mechanic/tasks/report', {
        taskId,
        status,
        notes,
      });
      toast.success(response.data.message || 'Report submitted');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  // --- UI Rendering ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow bg-white">
      <h3 className="text-lg font-semibold">Submit Task Outcome</h3>

      <div>
        <label className="block text-sm font-medium">Task Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        >
          <option value="successful">Successful</option>
          <option value="partial">Partially Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional task notes..."
          className="mt-1 block w-full border rounded px-3 py-2"
          rows={4}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
};

export default MechanicTaskReporter;
