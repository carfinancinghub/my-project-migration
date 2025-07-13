// File: mechanicHealthCheck.js
// Path: backend/routes/mechanic/mechanicHealthCheck.js
// Author: Cod1 (05051400)

const express = require('express');
const axios = require('axios');
const router = express.Router();
const { logger } = require('@utils/logger');

router.get('/health', async (req, res) => {
  const endpoints = {
    '/api/mechanic/vin/:vin': 'down',
    '/api/escrow/notify-ready': 'down'
  };

  let isHealthy = true;

  try {
    const vinRes = await axios.get(`http://localhost:5000/api/mechanic/vin/1HGCM82633A004352`);
    if (vinRes.status === 200 && vinRes.data?.make) {
      endpoints['/api/mechanic/vin/:vin'] = 'up';
    } else {
      isHealthy = false;
    }
  } catch (err) {
    logger.error('[HealthCheck] VIN decode failed', err.message);
    isHealthy = false;
  }

  try {
    const notifyRes = await axios.post(`http://localhost:5000/api/escrow/notify-ready`, {
      vehicleId: '123'
    });
    if (notifyRes.status === 200 && notifyRes.data?.success) {
      endpoints['/api/escrow/notify-ready'] = 'up';
    } else {
      isHealthy = false;
    }
  } catch (err) {
    logger.error('[HealthCheck] Escrow notify failed', err.message);
    isHealthy = false;
  }

  return res.json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    endpoints
  });
});

module.exports = router;
