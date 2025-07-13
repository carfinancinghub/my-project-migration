// File: listingController.js
// Path: backend/controllers/listingController.js

const Listing = require('../../server/models/Listing');

// Get all active listings
exports.getAllActiveListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'Active' })
      .populate('carId')
      .populate('sellerId', 'name');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

// Get a specific listing by ID
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('carId')
      .populate('sellerId', 'name');
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
};

// Create a new listing (seller only)
exports.createListing = async (req, res) => {
  try {
    const { carId, auctionId, isFeatured, expiresAt } = req.body;
    const listing = new Listing({
      carId,
      auctionId,
      sellerId: req.user._id,
      isFeatured,
      expiresAt,
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
};
