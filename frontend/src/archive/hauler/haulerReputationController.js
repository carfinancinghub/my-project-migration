// File: haulerReputationController.js
// Path: backend/controllers/hauler/haulerReputationController.js
// 👑 Cod1 Certified — Hauler Reputation Update Engine

const HaulerReputation = require('../../models/hauler/HaulerReputation');

const updateHaulerReputation = async ({ haulerId, jobId, rating, feedback }) => {
  try {
    let rep = await HaulerReputation.findOne({ haulerId });
    if (!rep) {
      rep = new HaulerReputation({ haulerId });
    }

    // Update aggregate stats
    rep.totalReviews += 1;
    rep.totalStars += rating;
    rep.averageRating = parseFloat((rep.totalStars / rep.totalReviews).toFixed(2));

    // Append recent rating (limit to last 10)
    rep.recentRatings.unshift({ jobId, rating, feedback, submittedAt: new Date() });
    if (rep.recentRatings.length > 10) {
      rep.recentRatings.pop();
    }

    await rep.save();
    return rep;
  } catch (err) {
    console.error('Failed to update hauler reputation:', err);
    throw new Error('Could not update hauler reputation');
  }
};

module.exports = { updateHaulerReputation };
