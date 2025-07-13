/**
 * File: TaskCompletionButton.jsx
 * Path: frontend/src/components/mechanic/TaskCompletionButton.jsx
 * Purpose: Button component to allow mechanics to mark a task as completed, integrating with real-time socket and API
 * Author: Cod1 (05060019)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSocket } from '@/hooks/useSocket';
import { PremiumFeature } from '@/components/common/PremiumFeature';

/**
 * TaskCompletionButton Component
 * Props:
 *   - taskId: string (ID of the task to complete)
 *   - mechanicId: string (ID of the mechanic)
 *   - timestamp: string (ISO timestamp of completion)
 */
const TaskCompletionButton = ({ taskId, mechanicId, timestamp }) => {
  const [isLoading, setIsLoading] = useState(false);
  const socket = useSocket();

  const handleCompleteTask = async () => {
    if (!taskId || !mechanicId || !timestamp) {
      toast.error('Missing task data');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('/api/mechanic/task-completed', {
        taskId,
        mechanicId,
        timestamp,
      });

      toast.success(response.data.message);

      if (socket) {
        socket.emit('task-completed', {
          taskId,
          mechanicId,
          timestamp,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Task completion failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PremiumFeature feature="mechanicEnterprise">
      <button
        onClick={handleCompleteTask}
        disabled={isLoading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {isLoading ? 'Completing...' : 'Mark as Completed'}
      </button>
    </PremiumFeature>
  );
};

export default TaskCompletionButton;
