/*
File: reminderService.ts
Path: C:\CFH\backend\services\notifications\reminderService.ts
Created: 2025-07-04 13:00 PDT
Author: Mini (AI Assistant)
Version: 1.1
Description: Service for scheduling and managing reminders for various platform entities with full logic.
Artifact ID: y0z1a2b3-c4d5-e6f7-g8h9-i0j1k2l3m4n5
Version ID: z1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o7 // New unique ID for version 1.1
*/

import logger from '@/utils/logger'; // Centralized logging utility
import { v4 as uuidv4 } from 'uuid'; // For generating IDs

// --- Mock Dependencies for local testing ---
// Cod1+ TODO: Replace with actual repository, task scheduler, and notification services
class MockReminderRepository {
    private reminders: any[] = []; // In-memory store for mock

    async create(reminder: any): Promise<any> {
        this.reminders.push(reminder);
        logger.debug(`MockReminderRepository: Created reminder ${reminder.id}`);
        return { ...reminder, _id: uuidv4() }; // Simulate DB ID
    }

    async findPendingByUser(userId: string): Promise<any[]> {
        logger.debug(`MockReminderRepository: Finding pending reminders for user ${userId}`);
        // Filter by user and status 'pending', and remindAt in future/near future
        const now = Date.now();
        return this.reminders.filter(r =>
            r.userId === userId && r.status === 'pending' && new Date(r.remindAt).getTime() > (now - 5 * 60 * 1000) // Within 5 mins in past or future
        );
    }

    async updateStatus(reminderId: string, status: string): Promise<boolean> {
        const index = this.reminders.findIndex(r => r.id === reminderId);
        if (index !== -1) {
            this.reminders[index].status = status;
            logger.debug(`MockReminderRepository: Updated reminder ${reminderId} status to ${status}`);
            return true;
        }
        return false;
    }
}

class MockTaskScheduler {
    private scheduledTasks: any[] = [];
    async scheduleTask(name: string, time: Date, data: any): Promise<any> {
        this.scheduledTasks.push({ name, time, data });
        logger.debug(`MockTaskScheduler: Scheduled task "${name}" for ${time.toISOString()} with data: ${JSON.stringify(data)}`);
        // In a real scenario, this would interact with a job queue (e.g., BullMQ)
        // For immediate testing, we can simulate immediate execution or a very short delay
        setTimeout(() => {
            logger.debug(`MockTaskScheduler: Executing simulated task "${name}" for ${data.reminderId}`);
            // In a real system, this would trigger reminderService.sendReminderNotification
            // For testing, we'll just log it.
        }, time.getTime() - Date.now() > 0 ? time.getTime() - Date.now() : 10); // Execute if time is past, or with 10ms delay
        return { success: true, taskId: uuidv4() };
    }
}

class MockEmailService {
    async sendEmail(to: string, subject: string, message: string): Promise<boolean> {
        logger.debug(`MockEmailService: Sending email to ${to} - Subject: "${subject}"`);
        // Simulate email sending
        return true;
    }
}

class MockInAppNotificationService {
    async sendInAppNotification(userId: string, type: string, message: string): Promise<boolean> {
        logger.debug(`MockInAppNotificationService: Sending in-app notification to ${userId} - Type: "${type}"`);
        // Simulate in-app notification sending
        return true;
    }
}
// --- End Mock Dependencies ---


// Custom Error Class for Service Failures
export class ReminderServiceError extends Error {
    constructor(message: string, public originalError?: any) {
        super(message);
        this.name = 'ReminderServiceError';
        Object.setPrototypeOf(this, ReminderServiceError.prototype);
    }
}

// Define reminder types
type ReminderType = 'estimate_expiry_warning' | 'estimate_expiry_final' | 'job_progress_check';

// Define Reminder object structure (for persistence)
interface Reminder {
    id: string;
    entityType: 'estimate' | 'job' | 'auction';
    entityId: string;
    userId: string; // The user to remind
    shopId?: string; // The shop related to the reminder
    remindAt: string; // ISO datetime string
    type: ReminderType;
    status: 'pending' | 'sent' | 'cancelled';
    payload?: any; // Additional data for the reminder message
}

export class ReminderService {
    private repository: MockReminderRepository;
    private scheduler: MockTaskScheduler;
    private emailer: MockEmailService;
    private inAppNotifier: MockInAppNotificationService;

    constructor(
        repository: MockReminderRepository = new MockReminderRepository(),
        scheduler: MockTaskScheduler = new MockTaskScheduler(),
        emailer: MockEmailService = new MockEmailService(),
        inAppNotifier: MockInAppNotificationService = new MockInAppNotificationService()
    ) {
        this.repository = repository;
        this.scheduler = scheduler;
        this.emailer = emailer;
        this.inAppNotifier = inAppNotifier;
    }

    /**
     * Schedules an estimate expiry reminder. This is called when an estimate's expiry is set.
     * It should schedule multiple reminders (e.g., 24h before, 1h before).
     * @param estimateId The ID of the estimate.
     * @param expiresAt The ISO datetime string when the estimate expires.
     * @returns A promise that resolves when reminders are scheduled.
     * @throws {ReminderServiceError} If scheduling fails.
     */
    public async scheduleEstimateReminder(estimateId: string, expiresAt: string): Promise<void> {
        const startTime = process.hrtime.bigint();
        const correlationId = uuidv4();
        logger.info(`[CID:${correlationId}] ReminderService: Scheduling reminders for estimate ${estimateId} expiring at ${expiresAt}`, { correlationId });

        try {
            const expiryDate = new Date(expiresAt);
            if (isNaN(expiryDate.getTime())) {
                throw new ReminderServiceError('Invalid expiry date provided.');
            }

            // Cod1+ TODO: Fetch actual user ID and shop ID linked to estimate from estimateService/repository
            // For now, using mock IDs
            const userId = 'mockUserId_est_' + estimateId;
            const shopId = 'mockShopId_est_' + estimateId;

            // Schedule initial warning (e.g., 24 hours before expiry)
            const twentyFourHoursBefore = new Date(expiryDate.getTime() - 24 * 60 * 60 * 1000);
            if (twentyFourHoursBefore.getTime() > Date.now()) { // Only schedule if in the future
                const reminder1: Reminder = {
                    id: uuidv4(), entityType: 'estimate', entityId: estimateId, userId, shopId,
                    remindAt: twentyFourHoursBefore.toISOString(), type: 'estimate_expiry_warning', status: 'pending',
                    payload: { message: `Your estimate for ${estimateId} expires in 24 hours!`, estimateId }
                };
                await this.repository.create(reminder1);
                await this.scheduler.scheduleTask('sendEstimateReminder', twentyFourHoursBefore, { reminderId: reminder1.id, userId, shopId, message: reminder1.payload.message, correlationId });
                logger.info(`[CID:${correlationId}] Scheduled 24hr reminder for ${estimateId}.`, { correlationId });
            }

            // Schedule final warning (e.g., 1 hour before expiry)
            const oneHourBefore = new Date(expiryDate.getTime() - 60 * 60 * 1000);
            if (oneHourBefore.getTime() > Date.now()) { // Only schedule if in the future
                const reminder2: Reminder = {
                    id: uuidv4(), entityType: 'estimate', entityId: estimateId, userId, shopId,
                    remindAt: oneHourBefore.toISOString(), type: 'estimate_expiry_final', status: 'pending',
                    payload: { message: `Your estimate for ${estimateId} expires in 1 hour! Act now!`, estimateId }
                };
                await this.repository.create(reminder2);
                await this.scheduler.scheduleTask('sendEstimateReminder', oneHourBefore, { reminderId: reminder2.id, userId, shopId, message: reminder2.payload.message, correlationId });
                logger.info(`[CID:${correlationId}] Scheduled 1hr reminder for ${estimateId}.`, { correlationId });
            }

            const endTime = process.hrtime.bigint();
            const responseTimeMs = Number(endTime - startTime) / 1_000_000;
            logger.info(`[CID:${correlationId}] Reminders for estimate ${estimateId} scheduled in ${responseTimeMs.toFixed(2)}ms.`, { correlationId });
            if (responseTimeMs > 500) { // CQS: <500ms response
                logger.warn(`[CID:${correlationId}] Schedule estimate reminder response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`, { correlationId });
            }
        } catch (error) {
            logger.error(`[CID:${correlationId}] ReminderService: Failed to schedule estimate reminders for ${estimateId}:`, error, { correlationId });
            throw new ReminderServiceError(`Failed to schedule estimate reminders.`, error);
        }
    }

    /**
     * Retrieves pending expiry reminders for a user/shop (Wow++ Tier).
     * This is used by the frontend to display notifications.
     * @param userId The ID of the user (or shop owner).
     * @returns An array of pending reminders.
     * @throws {ReminderServiceError} If retrieval fails.
     */
    public async getPendingEstimateReminders(userId: string): Promise<any[]> { // Using any[] for simplified mock
        const startTime = process.hrtime.bigint();
        const correlationId = uuidv4();
        logger.info(`[CID:${correlationId}] ReminderService: Fetching pending reminders for user: ${userId}`, { correlationId });

        try {
            // Cod1+ TODO: Fetch pending reminders from repository for the given user/shop
            const pendingReminders = await this.repository.findPendingByUser(userId);

            const endTime = process.hrtime.bigint();
            const responseTimeMs = Number(endTime - startTime) / 1_000_000;
            logger.info(`[CID:${correlationId}] Pending reminders for user ${userId} fetched in ${responseTimeMs.toFixed(2)}ms.`, { correlationId });
            if (responseTimeMs > 500) { // CQS: <500ms response
                logger.warn(`[CID:${correlationId}] Get pending reminders response time exceeded 500ms: ${responseTimeMs.toFixed(2)}ms`, { correlationId });
            }

            return pendingReminders;
        } catch (error) {
            logger.error(`[CID:${correlationId}] ReminderService: Failed to get pending reminders for user ${userId}:`, error, { correlationId });
            throw new ReminderServiceError(`Failed to retrieve pending reminders.`, error);
        }
    }

    /**
     * Internal method to send a reminder notification. This would be triggered by the task scheduler.
     * @param reminderId The ID of the reminder to send.
     * @param message The message content.
     * @param userId The recipient user ID.
     * @param shopId Optional: the recipient shop ID.
     * @param correlationId The correlation ID for logging.
     */
    public async sendReminderNotification(reminderId: string, message: string, userId: string, shopId?: string, correlationId?: string): Promise<void> {
        const currentCorrelationId = correlationId || uuidv4(); // Use provided or generate new
        logger.info(`[CID:${currentCorrelationId}] ReminderService: Sending notification for reminder ${reminderId} to user ${userId}`, { correlationId: currentCorrelationId });
        try {
            // Cod1+ TODO: Use emailService or inAppNotificationService to send notification
            await this.emailer.sendEmail(userId, 'Estimate Reminder', message);
            await this.inAppNotifier.sendInAppNotification(userId, 'estimate_reminder', message);
            logger.info(`[CID:${currentCorrelationId}] Notification for ${reminderId} sent successfully.`, { correlationId: currentCorrelationId });
            // Cod1+ TODO: Update reminder status in repository to 'sent'
            await this.repository.updateStatus(reminderId, 'sent');
        } catch (error) {
            logger.error(`[CID:${currentCorrelationId}] ReminderService: Failed to send notification for reminder ${reminderId}:`, error, { correlationId: currentCorrelationId });
            // Don't re-throw as task scheduler should handle retries, but log.
        }
    }
}

export const reminderService = new ReminderService();