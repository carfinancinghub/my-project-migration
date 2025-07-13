// File: listings.js
// Path: backend/routes/listings.js

const express = require('express');
const router = express.Router();
const Listing = require('../../server/models/Listing');
const { authenticateUser } = require('../middleware/authMiddleware');

// GET all active listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'Active' })
      .populate('carId')
      .populate('sellerId', 'name');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings.' });
  }
});

// GET a specific listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('carId')
      .populate('sellerId', 'name');
    if (!listing) return res.status(404).json({ error: 'Listing not found.' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listing.' });
  }
});

// POST a new listing
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { carId, auctionId, isFeatured, expiresAt } = req.body;
    const listing = new Listing({
      carId,
      auctionId,
      sellerId: req.user._id,
      isFeatured,
      expiresAt
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create listing.' });
  }
});

module.exports = router;
