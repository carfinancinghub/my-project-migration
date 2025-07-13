// File: paymentController.js
// Path: backend/controllers/paymentController.js

const Payment = require('../../server/models/Payment');

// Get all payments by user
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Admin gets all platform payments
exports.getAllPayments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch platform payments' });
  }
};

// Create a payment record (Stripe webhook or platform payout)
exports.createPayment = async (req, res) => {
  try {
    const payment = new Payment({
      ...req.body,
      userId: req.user._id,
    });
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record payment' });
  }
};

// Update payment status (admin only)
exports.updatePaymentStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const updated = await Payment.findByIdAndUpdate(
      req.params.paymentId,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};
