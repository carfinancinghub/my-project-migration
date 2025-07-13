/**
 * © 2025 CFH, All Rights Reserved
 * File: transcribeVoiceNote.ts
 * Path: C:\CFH\backend\controllers\hauler\transcribeVoiceNote.ts
 * Purpose: Downloads and transcribes a voice note associated with a job using an external speech-to-text API.
 * Author: Mini Team
 * Date: 2025-07-05 [2349]
 * Version: 1.0.0
 * Version ID: m1n0o9p8-q7r6-s5t4-u3v2-w1x0y9z8a7b6
 * Crown Certified: Yes
 * Batch ID: Compliance-070525
 * Artifact ID: m1n0o9p8-q7r6-s5t4-u3v2-w1x0y9z8a7b6
 * Save Location: C:\CFH\backend\controllers\hauler\transcribeVoiceNote.ts
 */

/*
 * --- Side Note: TypeScript Conversion & Enhancements ---
 *
 * 1. Strong Typing & Modern Syntax [Mini]:
 * - Converted all CommonJS `require` statements to ES Module `import`.
 * - Added Express `Request`, `Response`, and `NextFunction` types for type safety.
 * - Imported the `IJob` interface for strong typing.
 *
 * 2. Error Handling & Logging [Mini]:
 * - Replaced `console.error` with `@utils/logger`.
 * - Implemented `next(error)` with custom error classes.
 * - Added temporary file cleanup in a `finally` block.
 *
 * 3. Separation of Concerns (Suggestion) [Mini]:
 * - Consider moving download, transcription, and file management logic to a `TranscriptionService` for reusability.
 *
 * 4. Dependency Management (Suggestion) [Mini]:
 * - Install `@types/form-data` for TypeScript support: `npm install --save-dev @types/form-data`.
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import Job, { IJob } from '@models/Job';
import FormData from 'form-data';
import fs from 'fs/promises';
import { createReadStream } from 'fs/promises';
import path from 'path';
import logger from '@utils/logger';
import { NotFoundError, InternalServerError, BadRequestError } from '@utils/errors';
import { validateJobId } from '@validation/job.validation';

// --- Interfaces ---
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// --- Constants ---
const TEMP_DIR = path.join(__dirname, '../../tmp');

/**
 * @function transcribeVoiceNote
 * @desc Downloads a voice note associated with a job, sends it to a transcription service, and returns the transcript.
 */
const transcribeVoiceNote = async (req: AuthenticatedRequest<{ jobId: string }>, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params;
  const tempFilePath = path.join(TEMP_DIR, `temp_audio_${jobId}.mp3`);

  try {
    const { error } = validateJobId({ jobId });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const user = req.user?.id;
    if (!user) {
      throw new BadRequestError('Authentication required to transcribe voice note');
    }

    const job: IJob | null = await Job.findById(jobId);
    if (!job || !job.voiceNoteUrl) {
      throw new NotFoundError('Voice note not found for this job.');
    }

    await fs.mkdir(TEMP_DIR, { recursive: true });

    const downloadResponse = await axios.get(job.voiceNoteUrl, { responseType: 'arraybuffer' });
    await fs.writeFile(tempFilePath, downloadResponse.data);

    const form = new FormData();
    form.append('file', createReadStream(tempFilePath));
    form.append('model', 'whisper-1');

    const transcriptionResponse = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders(),
      },
    });

    const transcript = transcriptionResponse.data.text;

    // Optionally, save the transcript to the job document
    // job.transcript = transcript;
    // await job.save();

    res.status(200).json({ transcript });
  } catch (error: unknown) {
    logger.error(`m1n0o9p8: Transcription error for job ${jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next(new InternalServerError('Failed to transcribe voice note.'));
  } finally {
    try {
      await fs.unlink(tempFilePath);
    } catch (cleanupError) {
      logger.error(`m1n0o9p8: Failed to clean up temporary audio file: ${tempFilePath}: ${cleanupError instanceof Error ? cleanupError.message : 'Unknown error'}`);
    }
  }
};

export default transcribeVoiceNote;