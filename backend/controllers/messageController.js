// File: messageController.js
// Path: backend/controllers/messageController.js

const Message = require('../../server/models/Message');

// Get all messages for a conversation
exports.getMessagesByConversation = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Post a new message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const message = new Message({
      conversationId,
      senderId: req.user._id,
      content
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
