// File: HaulerCommunityBoard.jsx
// Path: frontend/src/components/hauler/HaulerCommunityBoard.jsx
// Author: Cod3 (05042219)
// Purpose: Provide haulers with a space to share tips, warnings, and community threads.
// Features:
//   - 💬 Thread Creation and Viewing (Free)
//   - ✅ Replies and Timestamps
//   - 🔐 Pro-Only Verified Threads (Planned)
// Status: ✅ Crown Certified — Modular, Thread-Based, Expandable

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PremiumFeature from '@components/common/PremiumFeature';

const mockThreads = [
  {
    title: 'Rainy Route Tips',
    creator: 'user123',
    replies: [
      { user: 'haulerX', content: 'Slow down on tight curves!', timestamp: '2025-05-01T10:00:00Z' },
      { user: 'speedyJ', content: 'Use tire chains early!', timestamp: '2025-05-01T11:00:00Z' }
    ],
    createdAt: '2025-05-01T09:00:00Z'
  },
  {
    title: 'Border Wait Times?',
    creator: 'user456',
    replies: [],
    createdAt: '2025-05-01T08:00:00Z'
  }
];

const HaulerCommunityBoard = () => {
  const [threads, setThreads] = useState(mockThreads);
  const [newTitle, setNewTitle] = useState('');

  const createThread = () => {
    if (!newTitle.trim()) return;
    const newThread = {
      title: newTitle,
      creator: 'currentUser',
      replies: [],
      createdAt: new Date().toISOString()
    };
    setThreads([newThread, ...threads]);
    setNewTitle('');
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">💬 Hauler Community Board</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Start a new thread..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button onClick={createThread} className="bg-blue-500 text-white px-3 py-1 rounded">Post</button>
      </div>
      {threads.map((thread, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 border rounded bg-gray-50"
        >
          <h3 className="font-semibold">{thread.title}</h3>
          <p className="text-sm text-gray-500">Started by {thread.creator} on {new Date(thread.createdAt).toLocaleString()}</p>
          {thread.replies.map((reply, ridx) => (
            <div key={ridx} className="mt-2 pl-3 border-l text-sm">
              <p><strong>{reply.user}</strong>: {reply.content}</p>
              <p className="text-xs text-gray-400">{new Date(reply.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default HaulerCommunityBoard;
