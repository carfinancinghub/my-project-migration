// File: index.js
// Path: backend/routes/seller/index.js
// 👑 Cod1 Crown Certified — Modular Seller Route Index with Listings + Profile

const express = require('express');
const router = express.Router();
const authenticate = require('../../../middleware/authenticate');
const Car = require('../../../models/Car');
const User = require('../../../models/User');

// 🛒 GET all listings for the seller
router.get('/listings', authenticate, async (req, res) => {
  try {
    const listings = await Car.find({ sellerId: req.user.id });
    res.json(listings);
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
});

// ➕ POST a new listing
router.post('/listings', authenticate, async (req, res) => {
  try {
    const newListing = new Car({ ...req.body, sellerId: req.user.id });
    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    console.error('Create listing error:', err);
    res.status(400).json({ message: 'Invalid listing data' });
  }
});

// 🔍 GET a single listing
router.get('/listings/:id', authenticate, async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, sellerId: req.user.id });
    if (!car) return res.status(404).json({ message: 'Not found' });
    res.json(car);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching listing' });
  }
});

// ❌ DELETE a listing
router.delete('/listings/:id', authenticate, async (req, res) => {
  try {
    await Car.deleteOne({ _id: req.params.id, sellerId: req.user.id });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

// 👤 GET seller profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Profile fetch error' });
  }
});

// 🔁 PATCH update seller profile
router.patch('/profile', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Profile update error' });
  }
});

module.exports = router;
