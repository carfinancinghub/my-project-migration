// File: messageRoutes.js
// Path: backend/routes/messages/messageRoutes.js
// 👑 Cod1 Crown Certified — Messaging API Routes (Polished with @ aliasing)

const express = require('express');
const router = express.Router();

const {
  sendMessage,
  getMessagesBetweenUsers,
  getMessagesByDisputeId,
  markMessageAsRead,
  deleteMessageForUser,
} = require('@/controllers/messages/messageController');

const { authenticateUser } = require('@/middleware/authMiddleware');

// 📬 Send a new message
router.post('/', authenticateUser, sendMessage);

// 💬 Get message history between two users
router.get('/:userA/:userB', authenticateUser, getMessagesBetweenUsers);

// ⚖️ Get all messages tied to a dispute
router.get('/dispute/:disputeId', authenticateUser, getMessagesByDisputeId);

// ✅ Mark message as read
router.patch('/:id/read', authenticateUser, markMessageAsRead);

// ❌ Soft delete message for sender or recipient
router.delete('/:id', authenticateUser, deleteMessageForUser);

module.exports = router;
