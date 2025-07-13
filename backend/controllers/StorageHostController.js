// File: StorageHostController.js
// Path: backend/controllers/StorageHostController.js
// Purpose: Manage storage host operations (listings, bookings)
// Author: Cod2 👑
// Date: 2025-04-28
// Status: Cod2 Crown Certified 👑

const Storage = require('../models/storage/Storage');
const asyncHandler = require('express-async-handler');

// @desc    Get all storage listings for a specific host
// @route   GET /api/storage/:hostId
// @access  Private (Storage Host, JWT Protected)
const getStorageListings = asyncHandler(async (req, res) => {
  const { hostId } = req.params;

  const listings = await Storage.find({ hostId });

  if (!listings) {
    res.status(404);
    throw new Error('No storage listings found for this host');
  }

  res.status(200).json(listings);
});

// @desc    Create a new storage listing
// @route   POST /api/storage/:hostId
// @access  Private (Storage Host, JWT Protected)
const createStorageListing = asyncHandler(async (req, res) => {
  const { hostId } = req.params;
  const { location, pricePerDay, capacity, amenities, description } = req.body;

  if (!location || !pricePerDay || !capacity) {
    res.status(400);
    throw new Error('Please provide all required fields (location, pricePerDay, capacity)');
  }

  const newListing = await Storage.create({
    hostId,
    location,
    pricePerDay,
    capacity,
    amenities,
    description,
  });

  res.status(201).json(newListing);
});

// @desc    Update a storage listing
// @route   PUT /api/storage/:hostId/:listingId
// @access  Private (Storage Host, JWT Protected)
const updateStorageListing = asyncHandler(async (req, res) => {
  const { hostId, listingId } = req.params;

  const listing = await Storage.findOne({ _id: listingId, hostId });

  if (!listing) {
    res.status(404);
    throw new Error('Storage listing not found');
  }

  const updatedListing = await Storage.findByIdAndUpdate(listingId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedListing);
});

// @desc    Delete a storage listing
// @route   DELETE /api/storage/:hostId/:listingId
// @access  Private (Storage Host, JWT Protected)
const deleteStorageListing = asyncHandler(async (req, res) => {
  const { hostId, listingId } = req.params;

  const listing = await Storage.findOne({ _id: listingId, hostId });

  if (!listing) {
    res.status(404);
    throw new Error('Storage listing not found');
  }

  await listing.remove();

  res.status(200).json({ message: 'Storage listing deleted successfully' });
});

module.exports = {
  getStorageListings,
  createStorageListing,
  updateStorageListing,
  deleteStorageListing,
};
