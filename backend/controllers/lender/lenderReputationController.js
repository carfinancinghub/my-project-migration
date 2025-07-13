// File: lenderReputationController.js
// Path: backend/controllers/lender/lenderReputationController.js

const LenderReputation = require('../../models/LenderReputation');

// GET /api/lender-reputation/:lenderId
exports.getReputation = async (req, res) => {
  try {
    const reputation = await LenderReputation.findOne({ lender: req.params.lenderId })
      .populate('lender', 'username')
      .populate('reviews.reviewer', 'username');

    if (!reputation) {
      return res.status(404).json({ message: 'Reputation not found' });
    }

    res.json(reputation);
  } catch (error) {
    console.error('Error fetching lender reputation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/lender-reputation/:lenderId/review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    let reputation = await LenderReputation.findOne({ lender: req.params.lenderId });

    if (!reputation) {
      reputation = new LenderReputation({ lender: req.params.lenderId, reviews: [] });
    }

    reputation.reviews.push({
      reviewer: req.user.id,
      rating,
      comment
    });

    // Recalculate average rating
    const total = reputation.reviews.reduce((sum, r) => sum + r.rating, 0);
    reputation.rating = total / reputation.reviews.length;
    reputation.updatedAt = Date.now();

    await reputation.save();
    res.status(201).json(reputation);
  } catch (error) {
    console.error('Error adding lender review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
