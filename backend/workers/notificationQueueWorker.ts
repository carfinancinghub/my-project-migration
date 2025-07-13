/*
 * File: notificationQueueWorker.ts
 * Path: backend/workers/notificationQueueWorker.ts
 * Created: 2025-06-30 14:28:10 PDT
 * Author: Mini (AI Assistant) & Grok 3 (xAI)
 * artifact_id: "96f7641d-ed21-4385-b7ff-f915e2d2aaf8"
 * version_id: "386716f9-b960-4fe0-a93a-2c3dca3ac8b0"
 * Version: 1.0
 * Description: Worker for processing notification queue jobs using Bull.
 */
import notificationQueue from '@utils/notificationQueue';
import { Job, DoneCallback } from 'bull';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

interface NotificationJobData { userId: string; eventType: string; message: string; }

logger.info('Notification worker started and waiting for jobs...');

notificationQueue.process(async (job: Job<NotificationJobData>, done: DoneCallback) => {
  logger.info(`START: Processing job ${job.id} for ${job.data.userId}`);
  try {
    if (job.attemptsMade < 2 && Math.random() > 0.5) throw new Error("Simulated failure");
    logger.info(`SUCCESS: Sent notification "${job.data.message}"`);
    done(null, { success: true });
  } catch (error) {
    logger.error(`FAILURE: Job ${job.id} failed`, { error });
    done(error as Error);
  }
});

process.on('SIGTERM', () => {
  logger.info('Shutting down gracefully...');
  notificationQueue.close().then(() => process.exit(0));
});