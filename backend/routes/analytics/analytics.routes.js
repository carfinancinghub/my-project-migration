/**
 * @file analytics.routes.ts
 * @path C:\CFH\backend\routes\analytics\analytics.routes.ts
 * @author Cod1 Team
 * @created 2025-06-11 [1810]
 * @purpose Defines API routes for the Analytics Dashboard with secure authentication, tier validation, and audit logging.
 * @user_impact Enables users to generate and export custom analytics reports securely.
 * @version 1.0.0
 */
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { AnalyticsService } from '@services/analytics/analytics.service';
import { validate } from '@middleware/validate';
import { customReportSchema, exportReportSchema } from '@validation/analytics.validation';
import { logger } from '@config/logger';
import { AuthorizationError, ValidationError } from '@utils/errors';
import { Tier } from '@utils/constants';
import { logAuditEncrypted } from '@services/auditLog';
const router = Router();
const analyticsService = new AnalyticsService();
const checkAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            logger.warn('No authorization token provided');
            throw new AuthorizationError('Unauthorized');
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = { userId: payload.userId };
        next();
    }
    catch (error) {
        logger.error('Authentication error', { error });
        res.status(403).json({ message: 'Unauthorized' });
    }
};
const checkTier = async (req, res, next) => {
    try {
        const tier = req.body.tier || req.query.tier;
        if (!Object.values(Tier).includes(tier)) {
            logger.warn(`Invalid tier: ${tier}`);
            throw new ValidationError('Invalid subscription tier');
        }
        next();
    }
    catch (error) {
        logger.error('Tier validation error', { error });
        res.status(400).json({ message: error.message });
    }
};
router.post('/reports/custom', checkAuth, checkTier, validate(customReportSchema), async (req, res) => {
    try {
        const start = Date.now();
        const { userId } = req.user;
        const reportData = req.body;
        const report = await analyticsService.generateCustomReport(userId, reportData);
        await logAuditEncrypted(userId, 'generateCustomReport', { reportId: report.id });
        const totalTime = Date.now() - start;
        res.status(201).json({ ...report, totalTimeMs: totalTime });
    }
    catch (error) {
        logger.error('Error generating custom report', { error });
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});
router.get('/reports/:reportId/export', checkAuth, checkTier, validate(exportReportSchema), async (req, res) => {
    try {
        const start = Date.now();
        const { userId } = req.user;
        const { reportId } = req.params;
        const { format } = req.query;
        if (format !== 'tableau') {
            throw new ValidationError('Unsupported export format');
        }
        const exportData = await analyticsService.exportReport(userId, reportId, format);
        await logAuditEncrypted(userId, 'exportReport', { reportId, format });
        const totalTime = Date.now() - start;
        res.status(200).json({ ...exportData, totalTimeMs: totalTime });
    }
    catch (error) {
        logger.error('Error exporting report', { error });
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});
export default router;
