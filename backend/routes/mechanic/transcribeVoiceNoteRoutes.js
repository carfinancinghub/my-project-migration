// File: transcribeVoiceNoteRoutes.js
// Path: backend/routes/mechanic/transcribeVoiceNoteRoutes.js
// Author: Cod1 (05061802)
// Description: Transcribes voice note into feedback (premium)

const express = require('express');
const router = express.Router();
const { transcribeVoiceNote } = require('@utils/mechanic/MechanicVoiceDictation');

// @route POST /api/mechanic/transcribe-voice-note
router.post('/api/mechanic/transcribe-voice-note', async (req, res) => {
  try {
    const { audioBuffer, taskId } = req.body;
    const result = await transcribeVoiceNote(audioBuffer, taskId, req.user);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
