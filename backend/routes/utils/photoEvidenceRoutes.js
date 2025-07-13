// File: photoEvidenceRoutes.js
// Path: backend/routes/utils/photoEvidenceRoutes.js
// 👑 Cod1 Crown Certified — Secure Photo Evidence API for Escrow & Hauler Insight

const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');

// Mock sample storage (replace with DB lookup or S3 logic)
const photoEvidenceStore = {
  'delivery123': [
    {
      url: 'https://example.com/delivery123_front.jpg',
      timestamp: '2025-04-18T10:00:00Z',
      tags: ['Front view', 'No visible damage']
    },
    {
      url: 'https://example.com/delivery123_back.jpg',
      timestamp: '2025-04-18T10:01:00Z',
      tags: ['Rear view', 'Minor scratch near bumper']
    }
  ],
  'delivery456': [] // no photos available
};

// GET /api/photo-evidence/:deliveryId
router.get('/:deliveryId', protect, (req, res) => {
  const { deliveryId } = req.params;
  const photos = photoEvidenceStore[deliveryId];

  if (!photos) {
    return res.status(404).json({ message: 'No photo evidence found for this delivery ID' });
  }

  res.json(photos);
});

module.exports = router;
