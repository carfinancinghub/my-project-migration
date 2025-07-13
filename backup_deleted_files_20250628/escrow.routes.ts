import express, { Request, Response, NextFunction } from 'express';
import logger from '@config/logger';
import { EscrowService, BadRequestError, AuthorizationError } from '@services/escrow/EscrowService';
import { validate, createTransactionSchema, proposeConditionSchema } from '@validation/escrow.validation';
import { User } from '@models/User';

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: User | null;
}

router.post('/create', validate(createTransactionSchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) throw new AuthorizationError('Unauthorized');
    const escrow = await EscrowService.createEscrow({ user: user.userId, vehicle: req.body.vehicle });
    res.status(201).json(escrow);
  } catch (error) {
    logger.error(`Create escrow error: ${(error as Error).message}`);
    next(error);
  }
});

router.post('/propose-condition/:id', validate(proposeConditionSchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) throw new AuthorizationError('Unauthorized');
    const escrow = await EscrowService.proposeCondition(req.params.id, req.body.condition);
    res.json(escrow);
  } catch (error) {
    logger.error(`Propose condition error: ${(error as Error).message}`);
    next(error);
  }
});

export default router;
