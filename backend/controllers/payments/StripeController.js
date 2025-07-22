// File: StripeController.js
// Path: backend/controllers/StripeController.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Initiates a payout using Stripe Connect
 * Assumes all recipients are connected Stripe accounts
 */
const initiatePayout = async (req, res) => {
  try {
    const { amount, currency, connectedAccountId, metadata } = req.body;

    const transfer = await stripe.transfers.create({
      amount,
      currency,
      destination: connectedAccountId,
      metadata: metadata || {},
    });

    res.status(200).json({ success: true, transfer });
  } catch (error) {
    console.error('Stripe payout error:', error);
    res.status(500).json({ success: false, message: 'Stripe payout failed', error });
  }
};

/**
 * Creates a payment intent to collect from the buyer
 * Optionally used for up-front buyer payments
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

module.exports = {
  initiatePayout,
  createPaymentIntent,
};
