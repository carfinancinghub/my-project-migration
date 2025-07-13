// File: storageRoutes.js
// Path: backend/routes/storage/storageRoutes.js
// Purpose: Define API routes for storage host operations
// Author: Cod2 👑
// Date: 2025-04-28
// Status: Cod2 Crown Certified 👑

const express = require('express');
const router = express.Router();
const {
  getStorageListings,
  createStorageListing,
  updateStorageListing,
  deleteStorageListing,
} = require('@controllers/StorageHostController'); // Controller functions
const { protect } = require('@middleware/authMiddleware'); // JWT Authentication Middleware

// @desc    Get all storage listings for a specific host
// @route   GET /api/storage/:hostId
// @access  Private (Storage Host only)
router.get('/:hostId', protect, getStorageListings);

// @desc    Create a new storage listing
// @route   POST /api/storage/:hostId
// @access  Private (Storage Host only)
router.post('/:hostId', protect, createStorageListing);

// @desc    Update an existing storage listing
// @route   PUT /api/storage/:hostId/:listingId
// @access  Private (Storage Host only)
router.put('/:hostId/:listingId', protect, updateStorageListing);

// @desc    Delete a storage listing
// @route   DELETE /api/storage/:hostId/:listingId
// @access  Private (Storage Host only)
router.delete('/:hostId/:listingId', protect, deleteStorageListing);

module.exports = router;
