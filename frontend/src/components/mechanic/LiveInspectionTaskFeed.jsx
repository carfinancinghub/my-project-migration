/**
 * File: LiveInspectionTaskFeed.jsx
 * Path: frontend/src/components/mechanic/LiveInspectionTaskFeed.jsx
 * Purpose: Live UI feed for incoming mechanic inspection tasks using Socket.IO
 * Author: Cod1 (05060737)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useEffect, useState } from 'react';
import { useMechanicSocket } from '@/hooks/useMechanicSocket';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';

/**
 * LiveInspectionTaskFeed Component
 * Purpose: Listens to WebSocket task-assigned events and renders live task feed
 */
const LiveInspectionTaskFeed = () => {
  const socket = useMechanicSocket();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!socket) return;

    /**
     * Handle 'task-assigned' event
     * @param {Object} task - Task payload with taskId, vehicle, priority, etc.
     */
    const handleTaskAssigned = (task) => {
      setTasks((prev) => [task, ...prev]);
      toast.info(`🛠️ New task assigned: ${task.vehicle}`);
    };

    socket.on('task-assigned', handleTaskAssigned);

    return () => {
      socket.off('task-assigned', handleTaskAssigned);
    };
  }, [socket]);

  // --- UI Rendering ---
  return (
    <div className="space-y-4 p-4 rounded bg-gray-50 shadow-inner">
      <h2 className="text-lg font-semibold">Live Inspection Task Feed</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned yet.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li key={index} className="border p-3 rounded bg-white">
              <div className="flex justify-between">
                <span className="font-medium">{task.vehicle}</span>
                <Badge>{task.priority || 'Normal'}</Badge>
              </div>
              <div className="text-xs text-gray-600">Task ID: {task.taskId}</div>
              <div className="text-xs text-gray-500">Assigned: {new Date(task.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LiveInspectionTaskFeed;
