// File: photoUploadRoutes.js
// Path: backend/routes/mechanic/photoUploadRoutes.js
// Author: Cod1 (05061759)
// Description: Uploads photos with optional AI damage tagging (premium)

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { classifyDamage } = require('@utils/ai/AIInspectionDamageClassifier');

const upload = multer({ dest: 'uploads/' }); // Temporary file store

// @route POST /api/mechanic/upload-photo
router.post('/api/mechanic/upload-photo', upload.single('image'), async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No image uploaded.' });

  const result = { filename: file.filename };

  if (req.user.subscription.includes('inspectionAI')) {
    result.tags = classifyDamage(file); // Simulated AI tagging
  }

  res.json(result);
});

module.exports = router;
