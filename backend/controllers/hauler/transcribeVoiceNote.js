// File: transcribeVoiceNote.js
// Path: backend/controllers/hauler/transcribeVoiceNote.js
// 👑 Cod1 Crown Certified — Voice Memo Transcription Engine

const axios = require('axios');
const Job = require('../../models/Job');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const transcribeVoiceNote = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job || !job.voiceNoteUrl) {
      return res.status(404).json({ message: 'Voice note not found for this job.' });
    }

    // Download voice file from URL
    const response = await axios.get(job.voiceNoteUrl, { responseType: 'arraybuffer' });
    const tempFilePath = path.join(__dirname, `temp_${jobId}.mp3`);
    fs.writeFileSync(tempFilePath, response.data);

    // Prepare request to OpenAI Whisper API (or any other speech-to-text engine)
    const form = new FormData();
    form.append('file', fs.createReadStream(tempFilePath));
    form.append('model', 'whisper-1');

    const transcriptRes = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders(),
      },
    });

    fs.unlinkSync(tempFilePath); // Clean up

    const transcript = transcriptRes.data.text;
    res.json({ transcript });
  } catch (err) {
    console.error('Transcription error:', err.message);
    res.status(500).json({ message: 'Failed to transcribe voice note.' });
  }
};

module.exports = transcribeVoiceNote;
