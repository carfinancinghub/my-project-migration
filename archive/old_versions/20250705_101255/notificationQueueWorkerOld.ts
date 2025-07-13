/*
 * File: notificationQueueWorker.ts
 * Path: C:\CFH\backend\workers\notificationQueueWorker.ts
 * Created: 06/30/2025 02:40 AM PDT
 * Modified: 06/30/2025 02:40 AM PDT
 * Description: Worker for processing notification queue jobs.
 * Author: Automated by Grok 3 (xAI)
 * Version: 1.0
 * Notes: Handles queue processing with error logging, compatible with Bull v3, fixed typing.
 */

import notificationQueue from '@utils/notificationQueue'; // Default import
import logger from '@config/logger';
import { Job, DoneCallback } from 'bull';

// Interface for job data
interface NotificationJobData {
  userId: string;
  eventType: string;
  message: string;
}

(notificationQueue as any).process((job: Job<NotificationJobData>, done: DoneCallback) => { // Force-cast to resolve typing
  try {
    logger.info(`Processing job [${job.id}]`, { name: job.name, data: job.data });
    done(null, { success: true, processedAt: new Date().toISOString() });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error processing job [${job.id}]: ${error.message}`, { error });
      done(error);
    } else {
      logger.error(`Unknown error processing job [${job.id}]`, { error: null });
      done(new Error('Unknown error') as Error);
    }
  }
});