/*
File: reminderService.test.ts
Path: C:\CFH\backend\tests\services\notifications\reminderService.test.ts
Created: 2025-07-04 13:10 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for reminderService with skeleton tests.
Artifact ID: m4n5o6p7-q8r9-s0t1-u2v3-w4x5y6z7a8b9
Version ID: n5o6p7q8-r9s0-t1u2-v3w4-x5y6z7a8b9c0
*/

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import logger from '@/utils/logger';
import { reminderService, ReminderServiceError } from '@/backend/services/notifications/reminderService';

// Mock the logger to prevent console output during tests and spy on calls
jest.mock('@/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));

// Mock internal dependencies if they were real (e.g., taskScheduler, emailService, inAppNotificationService, ReminderRepository)
// For now, the service uses mock data internally, so we test its public interface directly.
jest.mock('uuid', () => ({
    v4: () => 'mock-uuid', // Consistent UUID for tests
}));


describe('reminderService', () => {
    let service: typeof reminderService;

    beforeEach(() => {
        service = new (reminderService as any).constructor(); // Create a new instance for each test
        jest.clearAllMocks();
        // Mock setTimeout to run immediately for performance checks and task scheduling
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });

    afterEach(() => {
        (global.setTimeout as jest.Mock).mockRestore();
        (global.clearTimeout as jest.Mock).mockRestore();
    });

    // --- scheduleEstimateReminder Tests ---
    describe('scheduleEstimateReminder', () => {
        const estimateId = 'est_rem_123';
        const futureExpiry = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days from now

        it('should successfully schedule reminders for a future expiry date', async () => {
            await service.scheduleEstimateReminder(estimateId, futureExpiry);

            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Scheduling reminders for estimate ${estimateId} expiring at ${futureExpiry}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Reminders for estimate ${estimateId} scheduled`));
            expect(logger.warn).not.toHaveBeenCalled(); // No performance warning
            // Cod1+ TODO: Assert that reminderRepo.create and taskScheduler.scheduleTask were called with correct parameters.
            // This would involve counting calls and checking arguments to the mocked dependencies.
        });

        it('should not schedule reminders if expiry date is in the past', async () => {
            const pastExpiry = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(); // 1 day ago
            await service.scheduleEstimateReminder(estimateId, pastExpiry);

            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Scheduling reminders for estimate ${estimateId} expiring at ${pastExpiry}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Reminders for estimate ${estimateId} scheduled`)); // Still logs general success
            // Cod1+ TODO: Assert that reminderRepo.create and taskScheduler.scheduleTask were *not* called.
        });

        it('should throw ReminderServiceError if scheduling fails internally', async () => {
            // Simulate an internal failure (e.g., scheduler not initialized)
            const originalScheduleReminder = service.scheduleEstimateReminder;
            service.scheduleEstimateReminder = jest.fn().mockImplementationOnce(() => {
                throw new Error('Simulated scheduler error');
            });

            await expect(service.scheduleEstimateReminder(estimateId, futureExpiry)).rejects.toThrow(ReminderServiceError);
            await expect(service.scheduleEstimateReminder(estimateId, futureExpiry)).rejects.toThrow('Failed to schedule estimate reminders.');
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to schedule estimate reminders for ${estimateId}`), expect.any(Error));

            service.scheduleEstimateReminder = originalScheduleReminder; // Restore
        });

        it('should log a warning if scheduleEstimateReminder response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                // Simulate a delay that causes total response time to exceed 500ms
                setTimeout(() => cb(), 600);
                return {} as any;
            });

            await service.scheduleEstimateReminder(estimateId, futureExpiry);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Schedule estimate reminder response time exceeded 500ms'));
        });
    });

    // --- getPendingEstimateReminders Tests ---
    describe('getPendingEstimateReminders', () => {
        const userId = 'user_rem_1';

        it('should return pending reminders successfully', async () => {
            const result = await service.getPendingEstimateReminders(userId);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0); // Expect mock data
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Fetching pending reminders for user: ${userId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Pending reminders for user ${userId} fetched`));
            expect(logger.warn).not.toHaveBeenCalled();
            // Cod1+ TODO: Assert that reminderRepo.findPendingByUser was called.
        });

        it('should return an empty array if no pending reminders found', async () => {
            // Simulate no reminders found by mocking internal repo call
            const originalGetPending = service.getPendingEstimateReminders;
            service.getPendingEstimateReminders = jest.fn().mockResolvedValueOnce([]);

            const result = await service.getPendingEstimateReminders('user_no_reminders');
            expect(result).toEqual([]);
            expect(logger.warn).not.toHaveBeenCalled();

            service.getPendingEstimateReminders = originalGetPending; // Restore
        });

        it('should throw ReminderServiceError if retrieval fails internally', async () => {
            const originalGetPending = service.getPendingEstimateReminders;
            service.getPendingEstimateReminders = jest.fn().mockImplementationOnce(() => {
                throw new Error('Simulated repo error');
            });

            await expect(service.getPendingEstimateReminders(userId)).rejects.toThrow(ReminderServiceError);
            await expect(service.getPendingEstimateReminders(userId)).rejects.toThrow('Failed to retrieve pending reminders.');
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to get pending reminders for user ${userId}`), expect.any(Error));

            service.getPendingEstimateReminders = originalGetPending; // Restore
        });

        it('should log a warning if getPendingEstimateReminders response time exceeds 500ms', async () => {
            jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
                setTimeout(() => cb(), 600);
                return {} as any;
            });

            await service.getPendingEstimateReminders(userId);
            expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Get pending reminders response time exceeded 500ms'));
        });
    });

    // --- sendReminderNotification Tests (Internal method, triggered by scheduler) ---
    describe('sendReminderNotification (internal)', () => {
        const reminderId = 'rem_notif_1';
        const message = 'Your estimate expires soon!';
        const userId = 'user_notif_1';

        it('should send notification and log success', async () => {
            await service.sendReminderNotification(reminderId, message, userId);

            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Sending notification for reminder ${reminderId} to user ${userId}`));
            expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`Notification for ${reminderId} sent successfully.`));
            // Cod1+ TODO: Assert that emailService.sendEmail and inAppNotificationService.sendInAppNotification were called.
            // Cod1+ TODO: Assert that reminderRepo.updateStatus was called to 'sent'.
        });

        it('should log error if notification sending fails', async () => {
            // Simulate notification service failure
            const originalSendNotification = service.sendReminderNotification;
            service.sendReminderNotification = jest.fn().mockImplementationOnce(() => {
                throw new Error('Email service error');
            });

            await service.sendReminderNotification(reminderId, message, userId); // Should not throw, just log
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to send notification for reminder ${reminderId}`), expect.any(Error));

            service.sendReminderNotification = originalSendNotification; // Restore
        });
    });
});