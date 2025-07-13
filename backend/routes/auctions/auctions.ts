import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { authMiddleware } from '@middleware/authMiddleware';
import { User } from '@models/User';

const router = express.Router();

router.get('/', authMiddleware as RequestHandler, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ auctions: [] });
  } catch (error) {
    next(error);
  }
});

router.post('/bid', authMiddleware as RequestHandler, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ bid: 'mock' });
  } catch (error) {
    next(error);
  }
});

export default router;
