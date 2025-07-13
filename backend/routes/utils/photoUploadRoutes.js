// File: photoUploadRoutes.js
// Path: backend/routes/utils/photoUploadRoutes.js
// 📏 Cod1 Crown Certified — Secure Photo Upload Endpoint for Multi-Role Proof Modules

const express = require('express');
const multer = require('multer');
const { protect } = require('../../middleware/auth');
const router = express.Router();

// Storage configuration (disk-based for now, S3 or Cloudinary later)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/photos/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST /api/upload/photo
// Accepts a single photo file with optional caption + context (type, sourceId)
router.post('/photo', protect, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { caption, type, sourceId } = req.body;
    const photoData = {
      url: `/uploads/photos/${req.file.filename}`,
      caption,
      type,
      sourceId,
      uploadedBy: req.user.id,
      uploadedAt: new Date()
    };

    // Optional: Save metadata to DB later (future enhancement)
    res.status(201).json({ message: 'Photo uploaded successfully', data: photoData });
  } catch (err) {
    console.error('Photo upload error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
