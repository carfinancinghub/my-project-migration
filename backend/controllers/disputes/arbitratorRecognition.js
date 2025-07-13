// File: arbitratorRecognition.js
// Path: backend/controllers/disputes/arbitratorRecognition.js
// 👑 Cod1 Crown Certified — Arbitrator Badge Awarding Logic

const User = require('@/models/User'); // Clean root alias for User model

// Award recognition to arbitrator after case resolution
const awardArbitratorBadge = async (req, res) => {
  try {
    const { userId, caseId, outcome } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Initialize arbitration stats if missing
    user.arbitrationStats = user.arbitrationStats || { resolvedCases: 0, badges: [], reputation: 0 };

    user.arbitrationStats.resolvedCases += 1;

    // Award badges based on number of cases resolved
    if (user.arbitrationStats.resolvedCases === 1) {
      user.arbitrationStats.badges.push('First Verdict');
    } else if (user.arbitrationStats.resolvedCases === 5) {
      user.arbitrationStats.badges.push('Bronze Arbitrator');
    } else if (user.arbitrationStats.resolvedCases === 15) {
      user.arbitrationStats.badges.push('Silver Arbitrator');
    } else if (user.arbitrationStats.resolvedCases === 30) {
      user.arbitrationStats.badges.push('Gold Arbitrator');
    }

    // Adjust reputation score based on case outcome
    user.arbitrationStats.reputation += outcome === 'unanimous' ? 10 : 5;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Badge awarded and stats updated',
      arbitrationStats: user.arbitrationStats,
    });
  } catch (err) {
    console.error('Arbitrator recognition error:', err);
    res.status(500).json({ error: 'Failed to update arbitrator stats' });
  }
};

module.exports = {
  awardArbitratorBadge,
};
