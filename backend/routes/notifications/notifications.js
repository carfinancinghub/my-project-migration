/**
 * © 2025 CFH, All Rights Reserved
 * File: notifications.ts
 * Path: C:\CFH\backend\routes\notifications\notifications.ts
 * Purpose: Express route handlers for user notification management in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team
 * Date: 2025-06-22T17:39:00.000Z
 * Version: 1.0.0
 * Crown Certified: Yes
 * Batch ID: Notifications-062225
 */
import express from 'express';
import { authenticateToken } from '@middleware/authMiddleware';
import logger from '@utils/logger';
import { notificationService } from '@services/notificationService';
import { rateLimit } from 'express-rate-limit';
import Joi from 'joi';
const router = express.Router();
const batchSchema = Joi.object({
    notificationIds: Joi.array().items(Joi.string().required()).min(1).required(),
});
const dispatchLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many dispatch requests, please try again later',
});
router.post('/notifications/dispatch', authenticateToken, dispatchLimiter, async (req, res) => {
    try {
        await notificationService.dispatch(req.user.id, req.body);
        logger.info('Notification dispatched', { userId: req.user?.id, timestamp: new Date().toISOString() });
        res.status(200).json({ message: 'Notification dispatched' });
    }
    catch (err) {
        logger.error('Dispatch failed', { error: err.message, timestamp: new Date().toISOString() });
        res.status(500).json({ error: 'Dispatch failed' });
    }
});
router.get('/users/me/notifications', authenticateToken, async (req, res) => {
    try {
        const notifications = await notificationService.getNotifications(req.user.id);
        res.status(200).json(notifications);
    }
    catch (err) {
        logger.error('Fetch failed', { error: err.message, timestamp: new Date().toISOString() });
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
router.put('/users/me/notifications/:notificationId/read', authenticateToken, async (req, res) => {
    try {
        const { notificationId } = req.params;
        await notificationService.markRead(req.user.id, notificationId);
        res.status(200).json({ message: `Notification ${notificationId} marked as read` });
    }
    catch (err) {
        logger.error('Mark read failed', { error: err.message, timestamp: new Date().toISOString() });
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});
router.delete('/users/me/notifications/:notificationId', authenticateToken, async (req, res) => {
    try {
        const { notificationId } = req.params;
        await notificationService.deleteNotification(req.user.id, notificationId);
        res.status(200).json({ message: `Notification ${notificationId} deleted` });
    }
    catch (err) {
        logger.error('Delete failed', { error: err.message, timestamp: new Date().toISOString() });
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});
router.post('/batchMarkAsRead', authenticateToken, async (req, res) => {
    try {
        const { error } = batchSchema.validate(req.body);
        if (error) {
            logger.warn('Invalid batch mark read request', { error: error.details, timestamp: new Date().toISOString() });
            return res.status(400).json({ message: error.details[0].message });
        }
        await notificationService.batchMarkRead(req.user.id, req.body.notificationIds);
        res.status(200).json({ message: 'Notifications marked as read' });
    }
    catch (err) {
        logger.error('Batch mark read failed', { error: err.message, timestamp: new Date().toISOString() });
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
});
router.post('/batchDeleteNotifications', authenticateToken, async (req, res) => {
    try {
        const { error } = batchSchema.validate(req.body);
        if (error) {
            logger.warn('Invalid batch delete request', { error: error.details, timestamp: new Date().toISOString() });
            return res.status(400).json({ message: error.details[0].message });
        }
        await notificationService.batchDelete(req.user.id, req.body.notificationIds);
        res.status(200).json({ message: 'Notifications deleted' });
    }
    catch (err) {
        logger.error('Batch delete failed', { error: err.message, timestamp: new Date().toISOString() });
        res.status(500).json({ error: 'Failed to delete notifications' });
    }
});
router.post('/users/me/notifications/snooze', authenticateToken, async (req, res) => {
    try {
        const { until } = req.body;
        await notificationService.snooze(req.user.id, until);
        res.status(200).json({ message: `Snoozed until ${until}` });
    }
    catch (err) {
        logger.error('Snooze failed', { error: err.message, timestamp: new Date().toISOString() });
        res.status(500).json({ error: 'Failed to snooze notifications' });
    }
});
router.get('/notifications/leaderboards', authenticateToken, async (req, res) => {
    try {
        const leaderboard = await notificationService.getLeaderboards();
        res.status(200).json(leaderboard);
    }
    catch (err) {
        logger.error('Leaderboard fetch failed', { error: err.message, timestamp: new Date().toISOString() });
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});
export default router;
