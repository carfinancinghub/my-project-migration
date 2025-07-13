const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
try {
const notifications = await Notification.find();
res.json(notifications);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;