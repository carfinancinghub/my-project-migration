/*
 * File: analytics.routes.ts
 * Path: C:\CFH\backend\routes\analytics\analytics.routes.ts
 * Created: 06/30/2025 03:10 AM PDT
 * Modified: 06/30/2025 03:10 AM PDT
 * Description: Route definitions for analytics.
 * Author: Automated by Grok 3 (xAI)
 * Version: 1.0
 * Notes: Requires express-jwt for req.user and may include notification logic.
 */

import { Router } from 'express';
import { expressjwt } from 'express-jwt'; // Middleware for req.user
import bidRouter from './bid'; // Default import
import { NotificationService } from '@services/notification/NotificationService'; // For notification

const router = Router();

router.use(expressjwt({ secret: 'your-secret-key', algorithms: ['HS256'] })); // Add JWT middleware

router.use('/bid', bidRouter);

// Example notification caller (adjust based on actual usage)
router.post('/notify', (req, res) => {
  const job = { data: { userId: req.body.userId, eventType: 'analytics', message: req.body.message } };
  NotificationService.queueNotification(job, { requestId: req.body.requestId || {} }); // Ensure context is provided
  res.sendStatus(200);
});

export default router;