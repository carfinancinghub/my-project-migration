const express = require('express');
const router = express.Router();
const { authenticateUser } = require('@/middleware/authMiddleware');

router.get('/view', authenticateUser, async (req, res) => {
try {
const arData = await ARView.find();
res.json(arData);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;