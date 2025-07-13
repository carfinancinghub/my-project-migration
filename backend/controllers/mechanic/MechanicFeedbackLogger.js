// File: MechanicFeedbackLogger.js
// Path: backend/controllers/mechanic/MechanicFeedbackLogger.js
// Author: Cod1 (05061705)
// Description: Handles mechanic inspection feedback storage and premium sentiment analysis.

const feedbackDB = []; // In-memory mock storage; replace with DB model
const AIFeedbackSentiment = require('@utils/ai/AIFeedbackSentiment'); // Optional premium analysis

/**
 * Saves mechanic feedback for an inspection task
 * @param {Object} feedback - Contains taskId, notes, rating, photoRefs
 * @param {Object} user - Authenticated user object
 * @returns {Promise<Object>}
 */
const saveFeedback = async (feedback, user) => {
  const { taskId, notes, conditionRating, photoRefs } = feedback;

  if (!taskId || !notes) {
    throw new Error('Missing required feedback fields');
  }

  const record = {
    id: `${taskId}-${Date.now()}`,
    taskId,
    mechanicId: user.id,
    notes,
    conditionRating: conditionRating || null,
    photoRefs: photoRefs || [],
    createdAt: new Date(),
  };

  // Optional: Perform sentiment analysis if premium enabled
  if (user.subscription?.includes('feedbackSentimentPremium')) {
    const sentiment = await AIFeedbackSentiment.analyze(notes);
    record.sentiment = sentiment;
  }

  feedbackDB.push(record);
  return { success: true, feedback: record };
};

/**
 * Retrieves all feedback for a given task (used by dashboards)
 * @param {String} taskId
 * @returns {Array<Object>}
 */
const getFeedbackByTask = (taskId) => {
  return feedbackDB.filter(entry => entry.taskId === taskId);
};

module.exports = {
  saveFeedback,
  getFeedbackByTask,
};
