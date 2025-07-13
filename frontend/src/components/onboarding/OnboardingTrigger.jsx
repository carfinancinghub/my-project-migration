// File: OnboardingTrigger.js
// Path: frontend/src/components/onboarding/OnboardingTrigger.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OnboardingTrigger = () => {
  const [tasks, setTasks] = useState([]);
  const [visible, setVisible] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/onboarding/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (error) {
        console.warn('Using fallback onboarding tasks');
        setTasks([
          { id: 1, name: 'Complete your profile', completed: false },
          { id: 2, name: 'Upload ID verification', completed: false },
          { id: 3, name: 'Visit your dashboard', completed: true },
        ]);
      }
    };
    fetchProgress();
  }, []);

  const handleComplete = async (taskId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/onboarding/complete`, { taskId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
    } catch (err) {
      console.error('Error completing onboarding task:', err);
    }
  };

  const uncompletedTask = tasks.find(task => !task.completed);

  if (!visible || !uncompletedTask) return null;

  return (
    <div className="bg-blue-100 border border-blue-300 p-4 rounded shadow mb-4 flex justify-between items-center">
      <div className="text-sm text-blue-800 font-medium">
        🎯 Onboarding Tip: <span className="font-semibold">{uncompletedTask.name}</span>
      </div>
      <div className="flex gap-3">
        <button
          className="text-blue-600 hover:underline text-sm"
          onClick={() => handleComplete(uncompletedTask.id)}
        >
          Mark as Done
        </button>
        <button
          className="text-gray-500 hover:text-gray-800 text-sm"
          onClick={() => setVisible(false)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default OnboardingTrigger;
