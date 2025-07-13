/*
 * File: NotificationService.ts
 * Path: backend/services/notification/NotificationService.ts
 * Created: 2025-06-30 14:28:10 PDT
 * Author: Mini (AI Assistant) & Grok 3 (xAI)
 * artifact_id: "4c9ca24e-3c5c-4312-a71b-a7eb4cd7f27e"
 * version_id: "1b724ddd-6a65-4558-a787-c2ee5b3dc104"
 * Version: 1.0
 * Description: Service for handling email and other notifications via a queue.
 */
import pLimit from 'p-limit';
import notificationQueue from '@utils/notificationQueue'; // Assume Bull setup
import { Queue } from 'bull';
import * as sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY || 'default-key');

const limit = pLimit(1);
const deadLetterQueue = new Queue('dead-letter-queue', { redis: { host: 'localhost', port: 6379 } });

interface NotificationJobData { userId: string; eventType: string; message: string; }
interface NotificationJob { data: NotificationJobData; context: any; }

export class NotificationService {
  static async sendEmailNotification(userId: string, eventType: string, message: string): Promise<void> {
    const job = { userId, eventType, message };
    try {
      await limit(async () => {
        console.log(`INFO: Queueing email for ${userId} regarding ${eventType}`);
        await notificationQueue.add(job);
        // Send email via SendGrid
        await sendgrid.send({ to: userId, from: 'no-reply@cfh.com', subject: eventType, text: message });
      });
    } catch (error) {
      console.error('ERROR: Failed to queue email:', error);
      await deadLetterQueue.add({ ...job, error: (error as Error).message });
      throw error;
    }
  }

  static async queueNotification(job: NotificationJob, context: any): Promise<void> {
    try {
      console.log(`INFO: Processing notification for ${job.data.userId}`, context);
      // TODO: Implement real notification processing with SendGrid.
    } catch (error) {
      console.error('ERROR: Failed to process notification:', error);
      throw error;
    }
  }
}