// File: onboarding.js
// Path: backend/routes/users/onboarding.js

const express = require('express');
const router = express.Router();
const {
  getOnboardingProgress,
  completeOnboardingTask
} = require('../../controllers/users/onboardingController');

router.get('/progress/:userId', getOnboardingProgress);
router.post('/complete', completeOnboardingTask);

module.exports = router;
