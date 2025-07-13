import express, { Request, Response, RequestHandler } from 'express';
import { EscrowService } from '@services/escrow/EscrowService';
import { validate, createTransactionSchema, proposeConditionSchema } from '@validation/escrow.validation';

const router = express.Router();

const createEscrow: RequestHandler = async (req: Request, res: Response) => {
  try {
    const escrow = await EscrowService.createEscrow(req.body);
    res.status(201).json(escrow);
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

const proposeCondition: RequestHandler = async (req: Request, res: Response) => {
  try {
    const escrow = await EscrowService.proposeCondition(req.params.id, req.body);
    res.json(escrow);
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

router.post('/create', validate(createTransactionSchema), createEscrow);
router.post('/propose-condition/:id', validate(proposeConditionSchema), proposeCondition);

export default router;
