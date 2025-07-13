import express from 'express';
import { NotificationService } from '@services/notification/NotificationService';
import { EscrowService } from '@services/escrow/EscrowService';

const app = express();

app.use(express.json());

app.post('/api/notifications', async (req, res, next) => {
  try {
    await NotificationService.sendEmailNotification(req.body.userId, req.body.eventType, req.body.message);
    res.status(200).send('Notification sent');
  } catch (error) {
    next(error);
  }
});

app.post('/api/escrow', async (req, res, next) => {
  try {
    const escrow = await EscrowService.createEscrow(req.body);
    res.status(201).json(escrow);
  } catch (error) {
    next(error);
  }
});

export default app;
