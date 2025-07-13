// File: notificationController.js
// Path: backend/controllers/notificationController.js

const Notification = require('../../server/models/Notification');

// Get notifications for logged-in user
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Create new notification
exports.sendNotification = async (req, res) => {
  try {
    const { userId, type, message, relatedId } = req.body;
    const notification = new Notification({
      userId,
      type,
      message,
      relatedId,
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification || notification.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Notification not found or unauthorized' });
    }
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};
