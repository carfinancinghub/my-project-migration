// File: messageController.js
// Path: backend/controllers/messages/messageController.js

const Message = require('../../models/message/Message');
const { sendNotification } = require('../../utils/notificationService');

// POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { senderId, recipientId, content, disputeId, attachments, messageType } = req.body;

    const newMessage = new Message({
      senderId,
      recipientId,
      content,
      disputeId,
      attachments,
      messageType: messageType || 'text',
    });

    await newMessage.save();

    // Optional: Notify the recipient
    await sendNotification({
      userId: recipientId,
      type: 'message',
      message: '📨 You received a new message',
      link: `/messages/${senderId}`,
    });

    // Optional: Emit real-time event if socket.io injected
    if (req.io) {
      req.io.to(recipientId.toString()).emit('message:new', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// GET /api/messages/:userA/:userB
const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { userA, userB } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userA, recipientId: userB, deletedBySender: false },
        { senderId: userB, recipientId: userA, deletedByRecipient: false },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// GET /api/messages/dispute/:disputeId
const getMessagesByDisputeId = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const messages = await Message.find({ disputeId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dispute messages' });
  }
};

// PATCH /api/messages/:id/read
const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { read: true });
    res.status(200).json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};

// DELETE /api/messages/:id?user=userId
const deleteMessageForUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.query;
    const message = await Message.findById(id);

    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (message.senderId.toString() === user) {
      message.deletedBySender = true;
    } else if (message.recipientId.toString() === user) {
      message.deletedByRecipient = true;
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await message.save();
    res.status(200).json({ message: 'Message deleted for user' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete message' });
  }
};

module.exports = {
  sendMessage,
  getMessagesBetweenUsers,
  getMessagesByDisputeId,
  markMessageAsRead,
  deleteMessageForUser,
};
