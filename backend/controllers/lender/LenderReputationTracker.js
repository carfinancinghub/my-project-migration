// File: lenderReputationTracker.js
// Path: backend/controllers/lender/lenderReputationTracker.js

const LenderReputation = require('../models/LenderReputation');

// Get lender reputation
exports.getReputation = async (req, res) => {
  try {
    const reputation = await LenderReputation.findOne({ lender: req.params.lenderId })
      .populate('lender', 'username email')
      .populate('reviews.reviewer', 'username');
    if (!reputation) return res.status(404).json({ message: 'Reputation not found' });
    res.json(reputation);
  } catch (error) {
    console.error('[Reputation Fetch Error]:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a review to a lender
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const lenderId = req.params.lenderId;
    const reviewerId = req.user.id;

    let reputation = await LenderReputation.findOne({ lender: lenderId });
    if (!reputation) {
      reputation = new LenderReputation({ lender: lenderId, reviews: [] });
    }

    reputation.reviews.push({ reviewer: reviewerId, rating, comment });
    const avgRating =
      reputation.reviews.reduce((sum, r) => sum + r.rating, 0) / reputation.reviews.length;
    reputation.rating = avgRating;
    reputation.updatedAt = Date.now();

    await reputation.save();
    res.status(201).json(reputation);
  } catch (error) {
    console.error('[Add Review Error]:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
