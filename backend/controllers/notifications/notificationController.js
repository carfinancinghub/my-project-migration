// File: notificationController.js
// Path: backend/controllers/notifications/notificationController.js
// 👑 Cod1 Crown Certified — Notification System Engine

const Notification = require('@/models/notification/Notification');
const { enhanceNotification } = require('@/utils/notificationEnhancer');

// 📨 Fetch all notifications for logged-in user (or dummy test user in dev mode)
exports.getAllNotifications = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId || '000000000000000000000000'; // fallback

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications.map(enhanceNotification));
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// 🔢 Get unread notification count (with fallback)
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId || '000000000000000000000000'; // fallback dummy

    const count = await Notification.countDocuments({
      userId,
      read: false,
    });

    res.json({ unreadCount: count });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    res.status(500).json({ message: 'Failed to fetch unread count' });
  }
};

// ✅ Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

// ❌ Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};
