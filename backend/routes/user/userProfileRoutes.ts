/*
 * File: userProfileRoutes.ts
 * Path: C:\CFH\backend\routes\user\userProfileRoutes.ts
 * Created: 06/30/2025 03:10 AM PDT
 * Modified: 06/30/2025 03:10 AM PDT
 * Description: Route definitions for user profiles.
 * Author: Automated by Grok 3 (xAI)
 * Version: 1.0
 * Notes: Requires express-jwt for req.user.
 */

import { Router } from 'express';
import { expressjwt } from 'express-jwt'; // Middleware for req.user
import userProfile from './userProfile'; // Default import

const router = Router();

router.use(expressjwt({ secret: 'your-secret-key', algorithms: ['HS256'] })); // Add JWT middleware

router.use('/profile', userProfile);

export default router;