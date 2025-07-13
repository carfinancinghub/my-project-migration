// File: inspections.js
// Path: backend/routes/mechanic/inspections.js
// Purpose: Mechanic API to retrieve and enhance inspection data with AI and blockchain
// Author: Cod1 (05111359 - PDT)
// 👑 Cod2 Crown Certified

const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');
const { runDefectAnalysis } = require('@services/auction/AIDefectDetector');
const { logInspectionToBlockchain } = require('@services/blockchain/BlockchainVerifier');

/**
 * Functions Summary:
 * - GET /api/mechanic/inspections: Returns inspection records and runs AI/blockchain logic if premium.
 * Inputs: none (in real apps, role check or query filter would be added)
 * Outputs: Array of inspections with defects + blockchain logs (mocked)
 * Dependencies: express, logger, AIDefectDetector, BlockchainVerifier
 */
router.get('/', async (req, res) => {
  try {
    const mockInspections = [
      { id: 'i1', itemId: 'v1', status: 'Pending' },
      { id: 'i2', itemId: 'v2', status: 'Completed' }
    ];

    const enhanced = await Promise.all(
      mockInspections.map(async (entry) => {
        let defects = null;
        let audit = null;
        try {
          defects = await runDefectAnalysis(entry.itemId);
        } catch (aiErr) {
          logger.error('AI defect detection failed:', aiErr);
        }
        try {
          audit = await logInspectionToBlockchain(entry.id);
        } catch (bcErr) {
          logger.error('Blockchain logging failed:', bcErr);
        }
        return { ...entry, defects, audit };
      })
    );

    res.json({ inspections: enhanced });
  } catch (error) {
    logger.error('Failed to fetch inspections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;