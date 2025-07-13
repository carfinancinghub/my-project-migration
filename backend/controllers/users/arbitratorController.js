// File: arbitratorController.js
// Path: backend/controllers/users/arbitratorController.js

const User = require('@/models/User');


// GET /api/users/arbitrators
exports.getArbitrators = async (req, res) => {
  try {
    const arbitrators = await User.find({
      'arbitrationStats.resolvedCases': { $gt: 0 }
    }).select('username email arbitrationStats');

    res.status(200).json(arbitrators);
  } catch (error) {
    console.error('Failed to fetch arbitrators:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
