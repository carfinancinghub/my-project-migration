// File: claimsRoutes.js
// Path: backend/routes/insurance/claimsRoutes.js
// Author: Cod2 05051047
// 👑 Crown Certified

const express = require('express');
const router = express.Router();

let mockClaims = [
  { id: 'CLM001', userId: 'U123', vehicleId: 'V001', status: 'Pending', resolution: '' },
  { id: 'CLM002', userId: 'U456', vehicleId: 'V002', status: 'In Review', resolution: '' },
];

router.get('/claims', (req, res) => {
  res.status(200).json(mockClaims);
});

router.post('/claims/update', (req, res) => {
  const { id, status } = req.body;
  mockClaims = mockClaims.map((c) =>
    c.id === id ? { ...c, status, resolution: `Marked as ${status}` } : c
  );
  res.status(200).json({ message: `Claim ${id} updated to ${status}` });
});

module.exports = router;
