import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { authMiddleware } from '@middleware/authMiddleware';
import { User } from '@models/User';

const router = express.Router();

router.get('/', authMiddleware as RequestHandler, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ listings: [] });
  } catch (error) {
    next(error);
  }
});

export default router;
