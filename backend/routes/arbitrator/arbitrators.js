// File: arbitrators.js
// Path: backend/routes/users/arbitrators.js

const express = require('express');
const router = express.Router();
const { getArbitrators } = require('../../controllers/users/arbitratorController');

// GET /api/users/arbitrators
router.get('/', getArbitrators);

module.exports = router;
