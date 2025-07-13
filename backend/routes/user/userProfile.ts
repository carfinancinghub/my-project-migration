/*
 * File: userProfile.ts
 * Path: C:\CFH\backend\routes\user\userProfile.ts
 * Created: 06/30/2025 03:10 AM PDT
 * Modified: 06/30/2025 03:10 AM PDT
 * Description: Route handler for user profile.
 * Author: Automated by Grok 3 (xAI)
 * Version: 1.0
 * Notes: Requires express-jwt for req.user.
 */

import { Request, Response } from 'express';
import { expressjwt } from 'express-jwt'; // Middleware for req.user

const router = Router();

router.get('/profile', expressjwt({ secret: 'your-secret-key', algorithms: ['HS256'] }), (req: Request, res: Response) => {
  const user = req.user as any; // Type assertion until user type is defined
  res.json({ userId: user?.sub, email: user?.email });
});

export default router;