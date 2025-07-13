// File: useMechanicSocket.js
// Path: frontend/src/hooks/useMechanicSocket.js
// Author: Cod1 (05051245)

import { useEffect, useState } from 'react';

const useMechanicSocket = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      const sample = {
        id: 'task_' + Math.floor(Math.random() * 1000),
        vehicleId: 'VIN' + Math.floor(Math.random() * 9000),
        priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        timestamp: new Date().toLocaleString()
      };
      setTasks(prev => [sample, ...prev].slice(0, 5));
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return tasks;
};

export default useMechanicSocket;
