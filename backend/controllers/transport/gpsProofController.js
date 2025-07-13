// File: gpsProofController.js
// Path: backend/controllers/gpsProofController.js

const Delivery = require('../models/Delivery'); // Assumes Delivery model exists

// Log GPS proof-of-delivery
const logGPSProof = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { latitude, longitude, eventType } = req.body;

    if (!latitude || !longitude || !eventType) {
      return res.status(400).json({ error: 'Missing required GPS fields.' });
    }

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    const timestamp = new Date();

    delivery.gpsEvents = delivery.gpsEvents || [];
    delivery.gpsEvents.push({
      eventType,     // 'pickup' or 'dropoff'
      latitude,
      longitude,
      timestamp,
    });

    await delivery.save();

    res.status(200).json({ success: true, gpsEvent: { latitude, longitude, eventType, timestamp } });
  } catch (err) {
    console.error('GPS logging error:', err);
    res.status(500).json({ error: 'Failed to log GPS proof' });
  }
};

module.exports = {
  logGPSProof,
};
