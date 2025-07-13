/**
 * File: useMechanicSocket.js
 * Path: frontend/src/hooks/useMechanicSocket.js
 * Purpose: Hook to handle mechanic task-related WebSocket events (task assignment + task completion)
 * Author: Cod1 (05060719)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { toast } from 'react-toastify';

/**
 * useMechanicSocket Hook
 * Listens for task-assigned and task-completed WebSocket events
 * Returns: { assignedTasks: Array, completedTaskIds: Array }
 */
export const useMechanicSocket = () => {
  const socket = useSocket();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [completedTaskIds, setCompletedTaskIds] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Handle task assignment
    socket.on('task-assigned', (task) => {
      toast.info(`New task assigned: ${task.vehicle}`);
      setAssignedTasks((prev) => [...prev, task]);
    });

    // Handle task completion
    socket.on('task-completed', ({ taskId }) => {
      toast.success(`Task ${taskId} marked as completed`);
      setCompletedTaskIds((prev) => [...prev, taskId]);
    });

    // Clean up listeners
    return () => {
      socket.off('task-assigned');
      socket.off('task-completed');
    };
  }, [socket]);

  return { assignedTasks, completedTaskIds };
};
