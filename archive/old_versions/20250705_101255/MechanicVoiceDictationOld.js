// File: MechanicVoiceDictation.js
// Path: backend/utils/mechanic/MechanicVoiceDictation.js
// Author: Cod1 (05061637)
// Description: Voice dictation handler that transcribes mechanic audio and logs feedback

const speechRecognition = require('speech-to-text'); // Example placeholder
const { saveFeedback } = require('../../controllers/mechanic/MechanicFeedbackLogger');

const transcribeVoiceNote = async (audioBuffer, taskId, user) => {
  if (!user.subscription.includes('voiceDictationPremium')) {
    throw new Error('Premium feature: Voice dictation requires subscription');
  }

  try {
    const transcription = await speechRecognition.transcribe(audioBuffer);
    const feedback = {
      taskId,
      notes: transcription,
      conditionRating: null,
      photoRefs: [],
    };
    await saveFeedback(feedback, user);
    return { success: true, transcription };
  } catch (error) {
    throw new Error(`Transcription failed: ${error.message}`);
  }
};

module.exports = { transcribeVoiceNote };
