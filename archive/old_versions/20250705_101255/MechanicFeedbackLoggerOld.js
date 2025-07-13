// File: MechanicFeedbackLogger.js
// Path: backend/controllers/mechanic/MechanicFeedbackLogger.js
// Author: Cod1 (05061259)
// Description: Logs mechanic feedback with AI sentiment analysis and premium export support

const fs = require('fs');
const path = require('path');
const sentiment = require('sentiment');

const logMechanicFeedback = async (req, res) => {
  try {
    const { taskId, notes, conditionRating, photoRefs } = req.body;
    const { subscription, role } = req.user;

    if (!taskId || !notes || !conditionRating) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const feedbackEntry = {
      taskId,
      notes,
      conditionRating,
      photoRefs,
      createdAt: new Date(),
    };

    if (subscription === 'premium') {
      const sentimentScore = new sentiment().analyze(notes);
      feedbackEntry.sentimentScore = sentimentScore.score;
    }

    const dir = path.join(__dirname, '../../data/mechanic-feedback');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, `${taskId}.json`),
      JSON.stringify(feedbackEntry, null, 2)
    );

    return res.status(201).json({ message: 'Feedback logged successfully.', feedbackEntry });
  } catch (err) {
    console.error('Error logging mechanic feedback:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { logMechanicFeedback };
