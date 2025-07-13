const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/escrow', protect, async (req, res) => {
try {
const payments = await Payment.find({ type: 'escrow' });
res.json(payments);
} catch (error) {
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;